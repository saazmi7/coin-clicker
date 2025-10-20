// index.js (or server.js)
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(
  'https://bnvawkfainypdqcpmnlq.supabase.co',
  'eyJhbGciOiJIUzI1NiIs...'
);

app.use(express.json());

app.post('/frame', async (req, res) => {
  const fid = req.body.untrustedData.fid;

  const { data } = await supabase
    .from('scores')
    .select('points')
    .eq('fid', fid)
    .single();

  const points = data ? data.points : 0;

  res.json({
    frames: [
      {
        type: 'button',
        label: '💰 Click to Earn',
        action: '/click',
      }
    ],
    title: `You have ${points} coins!`,
  });
});

app.post('/click', async (req, res) => {
  const fid = req.body.untrustedData.fid;

  const { data } = await supabase
    .from('scores')
    .select('points')
    .eq('fid', fid)
    .single();

  const current = data?.points || 0;
  const newPoints = current + 1;

  await supabase
    .from('scores')
    .upsert({ fid, points: newPoints });

  res.json({
    frames: [
      {
        type: 'button',
        label: '💰 Click Again',
        action: '/click',
      }
    ],
    title: `🪙 You now have ${newPoints} coins!`,
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
