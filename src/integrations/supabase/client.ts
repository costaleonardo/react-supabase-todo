// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hfcyldgftdrrbvhcosis.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmY3lsZGdmdGRycmJ2aGNvc2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MTIzMTUsImV4cCI6MjA1MDQ4ODMxNX0.ffPr6Gxc7NRqO3LsYY0vqZ_JDKfAnxZpCxZFk2MD3-0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);