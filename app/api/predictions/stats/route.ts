import { NextResponse } from 'next/server';
import {
  getPredictionsCount,
  getPredictionsByClass,
} from '@/lib/db';

// GET - Get prediction statistics
export async function GET() {
  try {
    const totalPredictions = getPredictionsCount();
    const healthyPredictions = getPredictionsByClass('Healthy');
    const bleachedPredictions = getPredictionsByClass('Bleached');

    return NextResponse.json({
      success: true,
      data: {
        total: totalPredictions,
        healthy: healthyPredictions.length,
        bleached: bleachedPredictions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
