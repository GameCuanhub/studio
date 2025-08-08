
'use server';

import midtransClient from 'midtrans-client';
import { db } from '@/lib/firebase/config';
import { doc, runTransaction } from "firebase/firestore";
import type { UserProfile } from '@/types';
import type { TOKEN_PACKAGES } from '@/lib/constants';

// Initialize Midtrans Snap API
const snap = new midtransClient.Snap({
    isProduction: false, // Set to true for production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

interface TransactionDetails {
    order_id: string;
    gross_amount: number;
}

interface CustomerDetails {
    first_name: string;
    email: string;
}

export async function createMidtransTransaction(
    transactionDetails: TransactionDetails,
    customerDetails: CustomerDetails
) {
    const parameter = {
        transaction_details: transactionDetails,
        customer_details: customerDetails,
    };

    try {
        const transaction = await snap.createTransaction(parameter);
        return transaction;
    } catch (error) {
        console.error("Error creating Midtrans transaction:", error);
        throw new Error("Gagal membuat transaksi Midtrans.");
    }
}


export async function handleMidtransNotification(notification: any) {
  try {
    // 1. Verify the notification using Midtrans's utility
    const statusResponse = await snap.transaction.notification(notification);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}, Transaction Status: ${transactionStatus}, Fraud Status: ${fraudStatus}`);

    // 2. Extract user ID and package ID from order_id (e.g., "PINTARAI-USERID-PACKAGEID-TIMESTAMP")
    const parts = orderId.split('-');
    if (parts.length < 4 || parts[0] !== 'PINTARAI') {
      throw new Error("Invalid order_id format");
    }
    const userId = parts[1];
    const packageId = parts[2];
    
    // Find the package details from constants
    const { TOKEN_PACKAGES } = await import('@/lib/constants');
    const selectedPackage = TOKEN_PACKAGES.find(p => p.id === packageId);

    if (!selectedPackage) {
      throw new Error(`Package with ID ${packageId} not found.`);
    }

    // 3. Check transaction status and update user's token balance in a secure transaction
    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
      if (fraudStatus == 'accept') {
        // Securely update the user's token balance in Firestore
        const userRef = doc(db, "users", userId);
        await runTransaction(db, async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists()) {
            throw new Error(`User with ID ${userId} not found.`);
          }
          const currentBalance = userDoc.data().tokenBalance || 0;
          const newBalance = currentBalance + selectedPackage.tokens;
          transaction.update(userRef, { tokenBalance: newBalance });
          console.log(`Successfully updated token for user ${userId}. New balance: ${newBalance}`);
        });
      }
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      // Handle failed transaction
      console.log(`Payment failed for Order ID: ${orderId}. Status: ${transactionStatus}`);
    }

    return { status: 200, message: "Notification handled successfully." };

  } catch (error: any) {
    console.error("Error handling Midtrans notification:", error.message);
    return { status: 500, message: `Error: ${error.message}` };
  }
}
