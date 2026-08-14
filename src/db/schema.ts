import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  passwordHash: text('password_hash'),
  nativeLanguage: text('native_language'),
  currentLevel: text('current_level').default('A1.1'),
  targetLevel: text('target_level').default('A2.2'),
  goal: text('goal'),
  dailyMinutes: integer('daily_minutes').default(15),
  xp: integer('xp').default(0),
  currentStreak: integer('current_streak').default(0),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = sqliteTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const vocabulary = sqliteTable('vocabulary', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  germanWord: text('german_word').notNull(),
  englishMeaning: text('english_meaning').notNull(),
  article: text('article'), // der, die, das
  plural: text('plural'),
  partOfSpeech: text('part_of_speech'),
  cefrLevel: text('cefr_level').notNull(), // A1.1, A1.2, A2.1, A2.2
  topic: text('topic'),
  exampleSentence: text('example_sentence'),
  audioUrl: text('audio_url'),
});

export const userVocabularyProgress = sqliteTable('user_vocabulary_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id).notNull(),
  vocabularyId: integer('vocabulary_id').references(() => vocabulary.id).notNull(),
  masteryLevel: integer('mastery_level').default(0), // 0 to 100
  nextReviewDate: integer('next_review_date', { mode: 'timestamp_ms' }),
  lastReviewedDate: integer('last_reviewed_date', { mode: 'timestamp_ms' }),
  errorHistory: text('error_history', { mode: 'json' }),
});

export const grammarPoints = sqliteTable('grammar_points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  explanation: text('explanation').notNull(),
  pattern: text('pattern'),
  cefrLevel: text('cefr_level').notNull(),
  topic: text('topic'),
});

export const userGrammarProgress = sqliteTable('user_grammar_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id).notNull(),
  grammarPointId: integer('grammar_point_id').references(() => grammarPoints.id).notNull(),
  masteryLevel: integer('mastery_level').default(0),
  lastPracticed: integer('last_practiced', { mode: 'timestamp_ms' }),
});

export const modules = sqliteTable('modules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  cefrLevel: text('cefr_level').notNull(),
  order: integer('order').notNull(),
  description: text('description'),
});

export const lessons = sqliteTable('lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  moduleId: integer('module_id').references(() => modules.id).notNull(),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  type: text('type').notNull(), // vocabulary, grammar, reading, listening, conversation
  content: text('content', { mode: 'json' }),
});

export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  scenarioType: text('scenario_type'),
  difficulty: text('difficulty'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
  endedAt: integer('ended_at', { mode: 'timestamp_ms' }),
  transcript: text('transcript', { mode: 'json' }),
  score: integer('score'),
  feedback: text('feedback', { mode: 'json' }),
});

import { relations } from 'drizzle-orm';

export const modulesRelations = relations(modules, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
}));
