import { NextResponse } from 'next/server';
import { getAllPredictions, getPredictionsCount } from '@/lib/db';

export async function GET() {
  try {
    const predictions = await getAllPredictions();
    const count = await getPredictionsCount();
    
    return NextResponse.json({
      success: true,
      data: {
        count,
        predictions: predictions.slice(0, 5), // Show only first 5
        message: `Database working! Found ${count} predictions.`
      }
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}