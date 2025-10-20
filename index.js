const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

// ✅ Supabase credentials
const supabase = createClient(
  'https://bnvawkfainypdqcpmnlq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudmF3a2ZhaW55cGRxY3BtbmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzY4NjQsImV4cCI6MjA3NjM1Mjg2NH0.r76MRH9JZ2Xsp0Fvxh19P2cZPE1NOYPXQjDp0L52uAI'
);

app.use(express.json());

// ✅ Frame route — shows score and button
app.all('/frame', async (req, res) => {
  const fid = req.body?.untrustedData?.fid || 0;

  const { data } = await supabase
    .from('scores')
    .select('points')
    .eq('fid', fid)
    .single();

  const score = data ? data.points : 0;

  res.json({
    frames: [
      {
        type: 'button',
        label: '💰 Click to Earn',
        action: '/click'
      }
    ],
    title: `You have ${score} coins!`
  });
});

// ✅ Click route — adds +1 and shows new score
app.all('/click', async (req, res) => {
  const fid = req.body?.untrustedData?.fid || 0;

  const { data } = await supabase
    .from('scores')
    .select('points')
    .eq('fid', fid)
    .single();

  const current = data?.points || 0;
  const newScore = current + 1;

  await supabase
    .from('scores')
    .upsert({ fid, points: newScore });

  res.json({
    frames: [
      {
        type: 'button',
        label: '💰 Click Again',
        action: '/click'
      }
    ],
    title: `🪙 You now have ${newScore} coins!`
  });
});

// ✅ Start server
app.listen(3000, () => console.log('✅ Server running on port 3000'));
