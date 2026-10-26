CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int,
	`action` varchar(160) NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` varchar(100),
	`oldValue` json,
	`newValue` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`contentItemId` int,
	`certificateType` enum('course','achievement','project') NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`verificationCode` varchar(80) NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_verificationCode_unique` UNIQUE(`verificationCode`)
);
--> statement-breakpoint
CREATE TABLE `child_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int NOT NULL,
	`nickname` varchar(80) NOT NULL,
	`ageBand` enum('4_6','7_9','10_12','13_15') NOT NULL,
	`birthYear` int,
	`avatarKey` varchar(120) NOT NULL DEFAULT 'star',
	`interests` json NOT NULL,
	`learningLevel` enum('explorer','foundation','builder','future_ready') NOT NULL DEFAULT 'foundation',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `child_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `child_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`contentItemId` int NOT NULL,
	`status` enum('not_started','in_progress','completed','review_needed') NOT NULL DEFAULT 'not_started',
	`score` int,
	`attempts` int NOT NULL DEFAULT 0,
	`timeSpentSeconds` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `child_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `child_progress_unique` UNIQUE(`childId`,`contentItemId`)
);
--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int,
	`unitId` int,
	`subjectId` int NOT NULL,
	`slug` varchar(180) NOT NULL,
	`type` enum('lesson','activity','quiz','story','game','project','challenge','assessment','video','audio','pdf','simulation') NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`descriptionAr` text NOT NULL,
	`body` json,
	`minAge` int NOT NULL,
	`maxAge` int NOT NULL,
	`level` enum('explorer','foundation','builder','future_ready') NOT NULL,
	`skills` json NOT NULL,
	`durationMinutes` int NOT NULL DEFAULT 0,
	`xpReward` int NOT NULL DEFAULT 0,
	`coverUrl` text,
	`media` json,
	`quiz` json,
	`isReligious` boolean NOT NULL DEFAULT false,
	`publicationStatus` enum('draft','review','approved','published','archived') NOT NULL DEFAULT 'draft',
	`publishAt` timestamp,
	`sortOrder` int NOT NULL DEFAULT 0,
	`authorUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_items_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentItemId` int NOT NULL,
	`reviewerUserId` int NOT NULL,
	`reviewType` enum('editorial','islamic','safety','curriculum') NOT NULL,
	`status` enum('requested','changes_requested','approved','rejected') NOT NULL DEFAULT 'requested',
	`notes` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_source_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentItemId` int NOT NULL,
	`sourceId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_source_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_source_link_unique` UNIQUE(`contentItemId`,`sourceId`)
);
--> statement-breakpoint
CREATE TABLE `content_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`sourceType` enum('quran','hadith','seerah','book','article','curriculum','other') NOT NULL,
	`citation` text NOT NULL,
	`url` text,
	`hadithGrade` varchar(100),
	`reviewerName` varchar(160),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subjectId` int NOT NULL,
	`slug` varchar(160) NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`descriptionAr` text NOT NULL,
	`minAge` int NOT NULL,
	`maxAge` int NOT NULL,
	`level` enum('explorer','foundation','builder','future_ready') NOT NULL,
	`coverUrl` text,
	`xpReward` int NOT NULL DEFAULT 0,
	`publicationStatus` enum('draft','review','approved','published','archived') NOT NULL DEFAULT 'draft',
	`sortOrder` int NOT NULL DEFAULT 0,
	`authorUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `feature_flags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feature_flags_id` PRIMARY KEY(`id`),
	CONSTRAINT `feature_flags_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `parent_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`country` varchar(80),
	`privacyConsentAt` timestamp,
	`communicationPreference` enum('email','in_app','none') NOT NULL DEFAULT 'in_app',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parent_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `parent_profiles_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `parental_controls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`dailyMinutesLimit` int NOT NULL DEFAULT 45,
	`aiEnabled` boolean NOT NULL DEFAULT false,
	`aiMinutesLimit` int NOT NULL DEFAULT 0,
	`notificationsEnabled` boolean NOT NULL DEFAULT true,
	`allowedSubjects` json,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parental_controls_id` PRIMARY KEY(`id`),
	CONSTRAINT `parental_controls_child_unique` UNIQUE(`childId`)
);
--> statement-breakpoint
CREATE TABLE `platform_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`label` varchar(120) NOT NULL,
	`permissions` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `platform_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `platform_roles_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`kind` enum('xp','star','coin','badge','achievement') NOT NULL,
	`amount` int NOT NULL DEFAULT 0,
	`reason` varchar(255) NOT NULL,
	`contentItemId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skill_mastery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`skillId` int NOT NULL,
	`status` enum('not_started','learning','developing','mastered','review_needed') NOT NULL DEFAULT 'not_started',
	`score` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skill_mastery_id` PRIMARY KEY(`id`),
	CONSTRAINT `skill_mastery_unique` UNIQUE(`childId`,`skillId`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(150) NOT NULL,
	`titleAr` varchar(160) NOT NULL,
	`subjectId` int NOT NULL,
	`descriptionAr` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skills_id` PRIMARY KEY(`id`),
	CONSTRAINT `skills_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`titleAr` varchar(160) NOT NULL,
	`titleEn` varchar(160),
	`zone` varchar(100) NOT NULL,
	`icon` varchar(80) NOT NULL,
	`color` varchar(16) NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`),
	CONSTRAINT `subjects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`descriptionAr` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `units_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `audit_logs_entity_index` ON `audit_logs` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `child_profiles_parent_index` ON `child_profiles` (`parentId`);--> statement-breakpoint
CREATE INDEX `child_progress_child_status_index` ON `child_progress` (`childId`,`status`);--> statement-breakpoint
CREATE INDEX `content_subject_age_status_index` ON `content_items` (`subjectId`,`minAge`,`publicationStatus`);--> statement-breakpoint
CREATE INDEX `content_course_index` ON `content_items` (`courseId`);--> statement-breakpoint
CREATE INDEX `content_reviews_content_index` ON `content_reviews` (`contentItemId`);--> statement-breakpoint
CREATE INDEX `courses_subject_index` ON `courses` (`subjectId`);--> statement-breakpoint
CREATE INDEX `rewards_child_created_index` ON `rewards` (`childId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `units_course_index` ON `units` (`courseId`);