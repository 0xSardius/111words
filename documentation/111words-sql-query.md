-- Users table (Farcaster users)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid BIGINT UNIQUE NOT NULL,
  username TEXT,
  display_name TEXT,
  pfp_url TEXT,
  wallet_address TEXT,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_coins INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  last_write_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily writings/coins
CREATE TABLE writings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  fid BIGINT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  streak_day INTEGER NOT NULL,
  is_111_legend BOOLEAN DEFAULT FALSE,
  coin_address TEXT,
  tx_hash TEXT,
  coin_symbol TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  write_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Allow multiple writings per user per day for hackathon demos
  -- UNIQUE(fid, write_date) -- Removed for unlimited coin creation
);

-- Indexes for performance
CREATE INDEX idx_users_fid ON users(fid);
CREATE INDEX idx_writings_fid_date ON writings(fid, write_date);
CREATE INDEX idx_writings_created_at ON writings(created_at);
CREATE INDEX idx_writings_streak_day ON writings(streak_day);

-- Row Level Security (optional)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;

-- Useful views for analytics
CREATE VIEW daily_stats AS
SELECT 
  COUNT(DISTINCT fid) as daily_writers,
  COUNT(*) as daily_writings,
  SUM(word_count) as daily_words,
  AVG(word_count) as avg_word_count,
  COUNT(*) FILTER (WHERE is_111_legend = true) as legend_writings
FROM writings 
WHERE write_date = CURRENT_DATE;

-- SQL function for atomic writing creation + user update
CREATE OR REPLACE FUNCTION create_writing_and_update_user(
  p_fid BIGINT,
  p_content TEXT,
  p_word_count INTEGER,
  p_streak_day INTEGER,
  p_is_111_legend BOOLEAN,
  p_coin_address TEXT DEFAULT NULL,
  p_tx_hash TEXT DEFAULT NULL,
  p_coin_symbol TEXT DEFAULT NULL,
  p_write_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_writing writings%ROWTYPE;
  v_user users%ROWTYPE;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id FROM users WHERE fid = p_fid;
  
  -- Insert writing
  INSERT INTO writings (
    user_id, fid, content, word_count, streak_day, 
    is_111_legend, coin_address, tx_hash, coin_symbol, write_date
  ) VALUES (
    v_user_id, p_fid, p_content, p_word_count, p_streak_day,
    p_is_111_legend, p_coin_address, p_tx_hash, p_coin_symbol, p_write_date
  ) RETURNING * INTO v_writing;
  
  -- Update user stats (increment for each writing, streak only updates once per day)
  UPDATE users SET
    current_streak = CASE 
      WHEN last_write_date = p_write_date THEN current_streak  -- Same day, keep streak
      WHEN last_write_date = p_write_date - INTERVAL '1 day' THEN p_streak_day  -- Next day, update streak
      ELSE p_streak_day  -- Reset or new streak
    END,
    longest_streak = GREATEST(longest_streak, p_streak_day),
    total_coins = total_coins + 1,
    total_words = total_words + p_word_count,
    last_write_date = p_write_date,
    updated_at = NOW()
  WHERE fid = p_fid
  RETURNING * INTO v_user;
  
  RETURN json_build_object('writing', row_to_json(v_writing), 'user', row_to_json(v_user));
END;
$$ LANGUAGE plpgsql;