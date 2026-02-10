# Tasks: Todo CRUD API & Data Persistence

**Input**: Design documents from `/specs/2-todo-crud-api/`
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

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure with backend and frontend directories per implementation plan
- [ ] T002 [P] Initialize Python project with FastAPI dependencies in backend/requirements.txt
- [ ] T003 [P] Initialize Next.js 16+ project with App Router in frontend/package.json
- [ ] T004 [P] Install Better Auth library and JWT plugin in frontend/
- [ ] T005 [P] Install SQLModel and Neon PostgreSQL dependencies in backend/requirements.txt
- [ ] T006 [P] Configure linting and formatting tools for both services

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Set up database schema and migrations framework with Neon PostgreSQL
- [ ] T008 [P] Create SQLModel Task model in backend/src/models/task.py
- [ ] T009 [P] Create database connection utilities in backend/src/db/database.py
- [ ] T010 [P] Implement JWT utility functions in backend/src/utils/jwt.py
- [ ] T011 [P] Create initial database tables and indexes per data model
- [ ] T012 [P] Configure environment variables management in both services
- [ ] T013 [P] Set up shared BETTER_AUTH_SECRET in both frontend and backend
- [ ] T014 Create basic API client in frontend/src/services/apiClient.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create New Task (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to create new tasks with title and optional description

**Independent Test**: Can be fully tested by making a POST request to /api/{user_id}/tasks with valid task data and verifying that a new task is created in the database and assigned to the correct user.

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create signup form component in frontend/src/components/auth/SignupForm.tsx
- [ ] T016 [P] [US1] Create signup page in frontend/src/pages/signup.tsx
- [ ] T017 [US1] Implement signup API endpoint in backend/src/api/routes/auth.py
- [ ] T018 [US1] Implement user creation service in backend/src/services/user_service.py
- [ ] T019 [US1] Add email validation and password strength checks
- [ ] T020 [US1] Add duplicate email prevention logic
- [ ] T021 [US1] Create success/error feedback mechanism

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Task List (Priority: P1)

**Goal**: Enable authenticated users to view all their tasks in a list format

**Independent Test**: Can be fully tested by making a GET request to /api/{user_id}/tasks and verifying that only tasks belonging to the authenticated user are returned.

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create task list component in frontend/src/components/tasks/TaskList.tsx
- [ ] T023 [P] [US2] Create task list page in frontend/src/pages/tasks.tsx
- [ ] T024 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [ ] T025 [US2] Implement task retrieval service in backend/src/services/task_service.py
- [ ] T026 [US2] Add user ID validation to ensure users only see their own tasks
- [ ] T027 [US2] Add pagination support for task lists
- [ ] T028 [US2] Create loading and error states for task list

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Individual Task (Priority: P2)

**Goal**: Enable authenticated users to view the details of a specific task

**Independent Test**: Can be fully tested by making a GET request to /api/{user_id}/tasks/{id} and verifying that the correct task details are returned if the task belongs to the user.

### Implementation for User Story 3

- [ ] T029 [P] [US3] Create task detail component in frontend/src/components/tasks/TaskDetail.tsx
- [ ] T030 [P] [US3] Create task detail page in frontend/src/pages/tasks/[id].tsx
- [ ] T031 [US3] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [ ] T032 [US3] Add task retrieval by ID with ownership verification in task service
- [ ] T033 [US3] Add proper error handling for non-existent tasks
- [ ] T034 [US3] Add loading and error states for task detail view
- [ ] T035 [US3] Create back navigation from task detail to task list

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Update Task Details (Priority: P2)

**Goal**: Enable authenticated users to update task details including title, description, and completion status

**Independent Test**: Can be fully tested by making a PUT request to /api/{user_id}/tasks/{id} with updated task data and verifying that the task is updated correctly.

### Implementation for User Story 4

- [ ] T036 [P] [US4] Create task edit form component in frontend/src/components/tasks/TaskEditForm.tsx
- [ ] T037 [P] [US4] Create task edit page in frontend/src/pages/tasks/[id]/edit.tsx
- [ ] T038 [US4] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [ ] T039 [US4] Add task update service method with ownership verification
- [ ] T040 [US4] Add request validation for task update operations
- [ ] T041 [US4] Add proper error handling for update operations
- [ ] T042 [US4] Create success feedback for task updates

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Enable authenticated users to permanently delete their tasks

**Independent Test**: Can be fully tested by making a DELETE request to /api/{user_id}/tasks/{id} and verifying that the task is removed from the database.

### Implementation for User Story 5

- [ ] T043 [P] [US5] Create delete confirmation dialog in frontend/src/components/tasks/DeleteConfirmation.tsx
- [ ] T044 [P] [US5] Add delete button to task detail and list views
- [ ] T045 [US5] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [ ] T046 [US5] Add task deletion service method with ownership verification
- [ ] T047 [US5] Add proper error handling for delete operations
- [ ] T048 [US5] Add optimistic UI updates for task deletion
- [ ] T049 [US5] Create success feedback for task deletions

**Checkpoint**: At this point, User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Toggle Task Completion (Priority: P2)

**Goal**: Enable authenticated users to toggle the completion status of their tasks

**Independent Test**: Can be fully tested by making a PATCH request to /api/{user_id}/tasks/{id}/complete and verifying that the task's completion status is toggled.

### Implementation for User Story 6

- [ ] T050 [P] [US6] Create completion toggle component in frontend/src/components/tasks/CompletionToggle.tsx
- [ ] T051 [P] [US6] Add completion toggle to task list and detail views
- [ ] T052 [US6] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/src/api/routes/tasks.py
- [ ] T053 [US6] Add task completion toggle service method with ownership verification
- [ ] T054 [US6] Add proper error handling for completion toggle operations
- [ ] T055 [US6] Add optimistic UI updates for completion toggles
- [ ] T56 [US6] Create visual feedback for completion status changes

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T057 [P] Documentation updates in docs/
- [ ] T058 Error handling and validation across all endpoints
- [ ] T059 [P] Additional unit tests in backend/tests/unit/ and frontend/tests/
- [ ] T060 Security hardening (CORS, rate limiting, input sanitization)
- [ ] T061 Run quickstart.md validation

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
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 for viewing tasks
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US3 for task details
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Depends on US3 for task details
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Depends on US3 for task details

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All components within a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create signup form component in frontend/src/components/auth/SignupForm.tsx"
Task: "Create signup page in frontend/src/pages/signup.tsx"
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
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Stories 3-6 (sequentially or in priority order)
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