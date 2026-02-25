import { supabase } from '../lib/supabase';

/**
 * Sends an SMS/WhatsApp message via Supabase Edge Function
 * 
 * @param {string} to - Recipient phone number in E.164 format
 * @param {string} message - Message content
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendTwilioMessage = async (to, message) => {
  try {
    // Calling the Supabase Edge Function 'send-sms'
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { to, message },
    });

    if (error) {
      console.error('Error invoking function:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
};
