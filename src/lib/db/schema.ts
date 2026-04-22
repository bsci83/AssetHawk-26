/**
 * Drizzle ORM schema for Finance Friend.
 * All monetary values are stored as INTEGER cents (e.g., $12.34 = 1234).
 * All IDs are TEXT UUIDs generated via newId().
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const timestamp = () => text('created_at').default(sql`(datetime('now'))`);
const updatedAt = () => text('updated_at').default(sql`(datetime('now'))`);

// ─── Users ───────────────────────────────────────────────────────────

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  avatarUrl: text('avatar_url'),
  incomeFrequency: text('income_frequency'), // weekly | biweekly | semimonthly | monthly
  estimatedIncome: integer('estimated_income'), // cents per pay period
  onboardingComplete: integer('onboarding_complete', { mode: 'boolean' }).default(false),
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

// ─── Plaid Items (Bank Connections) ──────────────────────────────────

export const plaidItems = sqliteTable('plaid_items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token').notNull(), // AES-256-GCM encrypted
  itemId: text('item_id').unique().notNull(),
  institutionId: text('institution_id'),
  institutionName: text('institution_name'),
  cursor: text('cursor'), // for /transactions/sync pagination
  status: text('status').default('active'), // active | error | login_required
  errorCode: text('error_code'),
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

// ─── Linked Bank Accounts ────────────────────────────────────────────

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plaidItemId: text('plaid_item_id').notNull().references(() => plaidItems.id, { onDelete: 'cascade' }),
  plaidAccountId: text('plaid_account_id').unique().notNull(),
  name: text('name').notNull(),
  officialName: text('official_name'),
  type: text('type').notNull(), // depository | credit | loan | investment
  subtype: text('subtype'), // checking | savings | credit card | etc.
  mask: text('mask'), // last 4 digits
  balanceAvailable: integer('balance_available'), // cents
  balanceCurrent: integer('balance_current'), // cents
  balanceLimit: integer('balance_limit'), // cents
  isoCurrencyCode: text('iso_currency_code').default('USD'),
  isBusiness: integer('is_business', { mode: 'boolean' }).default(false),
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

// ─── Transactions ────────────────────────────────────────────────────

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  plaidTransactionId: text('plaid_transaction_id').unique(),
  amount: integer('amount').notNull(), // cents; positive = outflow, negative = inflow
  name: text('name').notNull(),
  merchantName: text('merchant_name'),
  merchantLogoUrl: text('merchant_logo_url'),
  date: text('date').notNull(), // YYYY-MM-DD
  authorizedDate: text('authorized_date'),
  categoryPrimary: text('category_primary'),
  categoryDetailed: text('category_detailed'),
  paymentChannel: text('payment_channel'), // online | in store | other
  pending: integer('pending', { mode: 'boolean' }).default(false),
  isRecurring: integer('is_recurring', { mode: 'boolean' }).default(false),
  isBusiness: integer('is_business', { mode: 'boolean' }).default(false),
  notes: text('notes'),
  createdAt: timestamp(),
});

// ─── Budgets ─────────────────────────────────────────────────────────

export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  periodStart: text('period_start').notNull(), // YYYY-MM-DD
  periodEnd: text('period_end').notNull(),
  totalIncome: integer('total_income').default(0), // cents
  totalAllocated: integer('total_allocated').default(0), // cents
  status: text('status').default('active'), // active | closed
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

export const budgetItems = sqliteTable('budget_items', {
  id: text('id').primaryKey(),
  budgetId: text('budget_id').notNull().references(() => budgets.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  allocated: integer('allocated').notNull(), // cents
  spent: integer('spent').default(0), // cents
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

// ─── Goals ───────────────────────────────────────────────────────────

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  targetAmount: integer('target_amount').notNull(), // cents
  currentAmount: integer('current_amount').default(0), // cents
  targetDate: text('target_date'), // YYYY-MM-DD
  category: text('category'), // emergency | vacation | debt | purchase | retirement | custom
  status: text('status').default('active'), // active | completed | paused | abandoned
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

export const goalMilestones = sqliteTable('goal_milestones', {
  id: text('id').primaryKey(),
  goalId: text('goal_id').notNull().references(() => goals.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  percentage: integer('percentage').notNull(), // 25, 50, 75, 100
  reachedAt: text('reached_at'),
  celebrated: integer('celebrated', { mode: 'boolean' }).default(false),
});

// ─── Bills ───────────────────────────────────────────────────────────

export const bills = sqliteTable('bills', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  merchantName: text('merchant_name'),
  amount: integer('amount').notNull(), // cents
  frequency: text('frequency').notNull(), // weekly | biweekly | monthly | quarterly | annual
  nextDueDate: text('next_due_date'),
  category: text('category'),
  isSubscription: integer('is_subscription', { mode: 'boolean' }).default(false),
  isBusiness: integer('is_business', { mode: 'boolean' }).default(false),
  autoDetected: integer('auto_detected', { mode: 'boolean' }).default(false),
  plaidStreamId: text('plaid_stream_id'),
  status: text('status').default('active'), // active | paused | cancelled
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

// ─── Spendcer (AI Coach) ─────────────────────────────────────────────

export const spendcerConversations = sqliteTable('spendcer_conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  createdAt: timestamp(),
  updatedAt: updatedAt(),
});

export const spendcerMessages = sqliteTable('spendcer_messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').notNull().references(() => spendcerConversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // user | assistant | system
  content: text('content').notNull(),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp(),
});

// ─── Forecasts & Scenarios ───────────────────────────────────────────

export const forecasts = sqliteTable('forecasts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  generatedAt: text('generated_at').default(sql`(datetime('now'))`),
  forecastDays: integer('forecast_days').notNull(), // 30, 60, 90
  data: text('data').notNull(), // JSON: array of { date, projectedBalance, income, expenses }
});

export const scenarios = sqliteTable('scenarios', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  adjustments: text('adjustments').notNull(), // JSON: { add: [], remove: [], modify: [] }
  resultData: text('result_data'), // JSON: forecast with adjustments
  createdAt: timestamp(),
});

// ─── Audit Log ───────────────────────────────────────────────────────

export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  details: text('details'), // JSON
  ipAddress: text('ip_address'),
  createdAt: timestamp(),
});

// ─── MedBill specific ──────────────────────────────────────────────

export const medicalBills = sqliteTable('medical_bills', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  fileContent: text('file_content'), // stored as base64 or text
  status: text('status').default('pending'), // pending, processing, completed, failed
  findings: text('findings'), // AI analysis results
  reviewedAt: text('reviewed_at'),
  createdAt: timestamp(),
});
