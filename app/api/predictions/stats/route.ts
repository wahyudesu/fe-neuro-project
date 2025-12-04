import { NextResponse } from 'next/server';
import {
  getPredictionsCount,
  getPredictionsByClass,
  initDatabase,
} from '@/lib/db';

// Attempt DB initialization at module load to report DB errors early.
void initDatabase().catch((err) => {
  console.warn('⚠️ DB init (stats route) failed:', err?.message ?? err);
});

// GET - Get prediction statistics
export async function GET() {
  try {
    const totalPredictions = await getPredictionsCount();
    const healthyPredictions = await getPredictionsByClass('Healthy');
    const bleachedPredictions = await getPredictionsByClass('Bleached');

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
