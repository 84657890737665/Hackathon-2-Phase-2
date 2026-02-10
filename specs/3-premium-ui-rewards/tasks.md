# Tasks: Premium Enterprise UI with Reward System

**Input**: Design documents from `/specs/3-premium-ui-rewards/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create frontend directory structure per implementation plan
- [X] T002 [P] Install Next.js 16+ with App Router in frontend/
- [X] T003 [P] Install required dependencies: react-confetti, zustand, react-use, framer-motion, lucide-react, @radix-ui/react-toast, class-variance-authority, clsx, tailwind-merge
- [X] T004 Initialize Tailwind CSS configuration with custom color palette, gradients, shadows, and animations per research.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T005 Setup database schema with RewardProfile, Achievement, UserAchievement, and TaskCompletion entities per data-model.md
- [ ] T006 [P] Implement JWT-based authentication framework with Better Auth per spec.md FR-002
- [ ] T007 [P] Setup API routing and middleware structure with user ID validation per spec.md FR-004
- [ ] T008 Create base models/entities that all stories depend on (User, Task) per data-model.md
- [ ] T009 Configure error handling and logging infrastructure
- [ ] T010 Setup environment configuration management for shared BETTER_AUTH_SECRET per constitution.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Premium UI Experience (Priority: P1) 🎯 MVP

**Goal**: Implement visually stunning UI with gradient backgrounds, smooth animations, and professional design elements that create a "wow" factor

**Independent Test**: The application presents a visually impressive interface with gradient backgrounds, smooth animations, and professional design elements that create a "wow" factor upon first impression

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

- [ ] T011 [P] [US1] Contract test for landing page endpoint in tests/contract/test_landing_page.py
- [ ] T012 [P] [US1] Integration test for UI rendering in tests/integration/test_ui_rendering.py

### Implementation for User Story 1

- [X] T013 [P] [US1] Create landing page with gradient hero background in frontend/app/page.tsx per plan.md
- [X] T014 [P] [US1] Create auth layout with gradient background in frontend/app/(auth)/layout.tsx per plan.md
- [X] T015 [US1] Create signup page with frosted glass card in frontend/app/(auth)/signup/page.tsx per plan.md
- [X] T016 [US1] Create signin page with frosted glass card in frontend/app/(auth)/signin/page.tsx per plan.md
- [X] T017 [US1] Create dashboard layout with gradient background in frontend/app/(dashboard)/layout.tsx per plan.md
- [X] T018 [US1] Create Header component with proper styling in frontend/components/layout/Header.tsx per plan.md
- [X] T019 [US1] Create Sidebar component with proper styling in frontend/components/layout/Sidebar.tsx per plan.md
- [X] T020 [US1] Create TaskCard component with premium styling in frontend/components/tasks/TaskCard.tsx per plan.md
- [X] T021 [US1] Create TaskList component with grid layout in frontend/components/tasks/TaskList.tsx per plan.md
- [X] T022 [US1] Create TaskCreateModal component with animations in frontend/components/tasks/TaskCreateModal.tsx per plan.md
- [X] T023 [US1] Create TaskListSkeleton with shimmer effect in frontend/components/tasks/TaskListSkeleton.tsx per plan.md
- [X] T024 [US1] Create EmptyState with gradient illustrations in frontend/components/tasks/EmptyState.tsx per plan.md
- [X] T025 [US1] Update globals.css with premium design tokens per research.md
- [X] T026 [US1] Add Inter font configuration to layout.tsx per plan.md
- [X] T027 [US1] Implement responsive design for all components per spec.md acceptance scenario 3
- [X] T028 [US1] Add hover effects and animations to all interactive elements per spec.md acceptance scenario 2
- [X] T029 [US1] Ensure no plain white backgrounds across all pages per spec.md FR-005 and constitution.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Reward System Engagement (Priority: P1)

**Goal**: Implement gamified reward system with confetti celebrations, streak tracking, achievement badges, and points system that triggers on task completion

**Independent Test**: When a user completes a task, they receive immediate visual feedback through confetti celebrations, motivational messages, and updates to their streak and points counters

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T030 [P] [US2] Contract test for task completion endpoint with rewards in tests/contract/test_task_completion_rewards.py
- [ ] T031 [P] [US2] Integration test for reward system flow in tests/integration/test_reward_system.py

### Implementation for User Story 2

- [X] T032 [P] [US2] Create useRewardSystem hook with persistence in frontend/lib/hooks/useRewardSystem.ts per plan.md
- [X] T033 [US2] Create CompletionCelebration component with confetti in frontend/components/rewards/CompletionCelebration.tsx per plan.md
- [X] T034 [US2] Create StreakCounter component with fire emoji in frontend/components/rewards/StreakCounter.tsx per plan.md
- [X] T035 [US2] Create PointsDisplay component with star icon in frontend/components/rewards/PointsDisplay.tsx per plan.md
- [X] T036 [US2] Create AchievementBadge component with unlock states in frontend/components/rewards/AchievementBadge.tsx per plan.md
- [X] T037 [US2] Update TaskCard to trigger reward system on completion per plan.md
- [X] T038 [US2] Update Header to include StreakCounter and PointsDisplay per plan.md
- [X] T039 [US2] Implement confetti celebration on task completion per spec.md acceptance scenario 1
- [X] T040 [US2] Implement streak counter that updates daily per spec.md acceptance scenario 2
- [X] T041 [US2] Implement points display showing 10 points per task per spec.md acceptance scenario 3
- [X] T042 [US2] Implement achievement badges for milestones 1, 10, 50, 100 tasks per spec.md acceptance scenario 4
- [ ] T043 [US2] Update PATCH /api/{user_id}/tasks/{id}/complete endpoint to return rewards_earned per contracts/api-contracts.md
- [ ] T044 [US2] Create GET /api/{user_id}/rewards/profile endpoint per contracts/api-contracts.md
- [ ] T045 [US2] Create GET /api/{user_id}/achievements endpoint per contracts/api-contracts.md
- [ ] T046 [US2] Create GET /api/{user_id}/achievements/available endpoint per contracts/api-contracts.md
- [ ] T047 [US2] Create GET /api/{user_id}/completions/history endpoint per contracts/api-contracts.md

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Enhanced UI Components (Priority: P2)

**Goal**: Implement beautiful loading and empty states that remain polished during transitional moments

**Independent Test**: When content is loading or when there are no tasks to display, the user sees visually appealing skeleton screens with shimmer effects or engaging illustrations rather than boring placeholders

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T048 [P] [US3] Contract test for loading states in tests/contract/test_loading_states.py
- [ ] T049 [P] [US3] Integration test for empty states in tests/integration/test_empty_states.py

### Implementation for User Story 3

- [X] T050 [US3] Enhance TaskListSkeleton with shimmer animation per spec.md acceptance scenario 1
- [X] T051 [US3] Enhance EmptyState with gradient illustrations per spec.md acceptance scenario 2
- [X] T052 [US3] Implement skeleton screens for all loading states per spec.md FR-012
- [X] T053 [US3] Implement engaging empty states with illustrations per spec.md FR-013
- [X] T054 [US3] Update all components to show appropriate loading states during API calls
- [X] T055 [US3] Add smooth transitions between loading and loaded states

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T056 [P] Update README with setup instructions for premium UI features
- [ ] T057 Code cleanup and refactoring
- [ ] T058 Performance optimization across all stories (ensure 60fps animations per spec.md FR-007)
- [ ] T059 [P] Additional unit tests (if requested) in tests/unit/
- [ ] T060 Security hardening
- [ ] T061 Run quickstart.md validation
- [ ] T062 Accessibility audit and improvements per research.md
- [ ] T063 Cross-browser compatibility testing per research.md
- [ ] T064 Mobile responsiveness testing per research.md
- [ ] T065 Lighthouse performance audit (aim for >90 score per research.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for landing page endpoint in tests/contract/test_landing_page.py"
Task: "Integration test for UI rendering in tests/integration/test_ui_rendering.py"

# Launch all models for User Story 1 together:
Task: "Create landing page with gradient hero background in frontend/app/page.tsx per plan.md"
Task: "Create auth layout with gradient background in frontend/app/(auth)/layout.tsx per plan.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence