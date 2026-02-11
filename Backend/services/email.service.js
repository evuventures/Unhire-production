import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // 1s, 2s, 4s exponential backoff

/**
 * Lazy Resend client — only created when RESEND_API_KEY exists.
 * Avoids crashes when env vars are missing.
 */
let _resend = null;
const getResendClient = () => {
    if (_resend) return _resend;

    if (!process.env.RESEND_API_KEY) {
        return null;
    }

    _resend = new Resend(process.env.RESEND_API_KEY);
    return _resend;
};

/**
 * The "from" address used for all outbound emails.
 * Uses RESEND_FROM_EMAIL env var, or falls back to the Resend test address.
 */
const getFromAddress = () => {
    return process.env.RESEND_FROM_EMAIL || 'Unhire <onboarding@resend.dev>';
};

/**
 * Verify Resend API key is configured on startup.
 */
export const verifyTransporter = async () => {
    const resend = getResendClient();
    if (!resend) {
        console.log('[EMAIL] Resend API key not configured — emails will be mocked to console.');
        return false;
    }
    console.log('[EMAIL] Resend email service initialized ✅');
    return true;
};

/**
 * Helper: sleep for retry backoff
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Send an email with retry logic and exponential backoff.
 * Never throws — logs errors gracefully.
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} html - Email body (HTML)
 */
export const sendEmail = async (to, subject, html) => {
    const resend = getResendClient();

    if (!resend) {
        console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await resend.emails.send({
                from: getFromAddress(),
                to,
                subject,
                html,
            });
            console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
            return; // Success — exit
        } catch (error) {
            console.error(`[EMAIL ERROR] Attempt ${attempt}/${MAX_RETRIES} for ${to}:`, error.message);

            if (attempt < MAX_RETRIES) {
                const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
                console.log(`[EMAIL RETRY] Retrying in ${delay}ms...`);
                await sleep(delay);
            } else {
                console.error(`[EMAIL FAILED] All ${MAX_RETRIES} attempts failed for ${to} | Subject: ${subject}`);
            }
        }
    }
};

/**
 * Send project assignment email to expert
 */
export const sendProjectAssignmentEmail = async (expert, project) => {
    const subject = `New Project Assignment: ${project.title}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>You have a new project assignment!</h2>
            <p>Hello <b>${expert.name}</b>,</p>
            <p>You have been assigned to the project: <b>${project.title}</b>.</p>
            <p>You have <b>3 hours</b> to submit your draft.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/expert-dashboard" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Project</a>
        </div>
    `;
    await sendEmail(expert.email, subject, html);
};

/**
 * Send draft submitted email to client
 */
export const sendDraftSubmissionEmail = async (client, project) => {
    const subject = `Draft Submitted: ${project.title}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>A draft is ready for your review!</h2>
            <p>Hello <b>${client.name}</b>,</p>
            <p>An expert has submitted a draft for your project: <b>${project.title}</b>.</p>
            <p>Please review it and approve or reject it.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/client/project/${project._id}" style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Draft</a>
        </div>
    `;
    await sendEmail(client.email, subject, html);
};

/**
 * Send draft approval email to expert
 */
export const sendDraftApprovalEmail = async (expert, project) => {
    const subject = `Draft Approved: ${project.title}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Congratulations! Your draft was approved.</h2>
            <p>Hello <b>${expert.name}</b>,</p>
            <p>Your draft for <b>${project.title}</b> has been accepted by the client.</p>
            <p>The project is now marked as complete. Great work!</p>
        </div>
    `;
    await sendEmail(expert.email, subject, html);
};

/**
 * Send draft rejection email to expert
 */
export const sendDraftRejectionEmail = async (expert, project, reason) => {
    const subject = `Draft Rejected: ${project.title}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Your draft was not approved.</h2>
            <p>Hello <b>${expert.name}</b>,</p>
            <p>Unfortunately, your draft for <b>${project.title}</b> was rejected.</p>
            ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ''}
            <p>The project has been reassigned to another expert.</p>
        </div>
    `;
    await sendEmail(expert.email, subject, html);
};

/**
 * Send project expiration email to client
 */
export const sendProjectExpirationEmail = async (client, project) => {
    const subject = `Project Expired: ${project.title}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Project Expired</h2>
            <p>Hello <b>${client.name}</b>,</p>
            <p>Your project <b>${project.title}</b> has expired after maximum failed attempts.</p>
            <p>You can repost the project or contact support for assistance.</p>
        </div>
    `;
    await sendEmail(client.email, subject, html);
};

// --- NEW AUTH & NOTIFICATION TEMPLATES ---

/**
 * Send Verification Code (Login/Reset)
 */
export const sendVerificationEmail = async (user, code) => {
    const subject = `Your Verification Code`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Verification Code</h2>
            <p>Hello <b>${user.name}</b>,</p>
            <p>Your verification code is:</p>
            <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;
    await sendEmail(user.email, subject, html);
};

/**
 * Send Password Change Success Email
 */
export const sendPasswordChangeSuccessEmail = async (user) => {
    const subject = `Password Changed Successfully`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Password Changed</h2>
            <p>Hello <b>${user.name}</b>,</p>
            <p>Your password has been successfully changed.</p>
            <p>If you did not make this change, please contact support immediately.</p>
        </div>
    `;
    await sendEmail(user.email, subject, html);
};

/**
 * Send Draft Rejected Email (to Expert)
 */
export const sendDraftRejectedEmail = async (expert, project) => {
    const subject = `Draft Rejected: ${project.title}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Draft Rejected</h2>
            <p>Hello <b>${expert.name}</b>,</p>
            <p>Your draft for <b>${project.title}</b> was rejected by the client.</p>
            <p>The project has been unassigned and will be offered to another expert.</p>
        </div>
    `;
    await sendEmail(expert.email, subject, html);
};
