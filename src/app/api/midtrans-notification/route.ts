
import { NextResponse } from 'next/server';
import { handleMidtransNotification } from '@/services/midtransService';

export async function POST(request: Request) {
  try {
    const notificationJson = await request.json();
    const { status, message } = await handleMidtransNotification(notificationJson);
    
    return NextResponse.json({ message }, { status });
    
  } catch (error: any) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json(
      { message: `Webhook error: ${error.message}` },
      { status: 400 }
    );
  }
}
