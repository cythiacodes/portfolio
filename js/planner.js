(function () {
    const STORAGE_KEY = 'cynthia_academic_tasks_data';

    const defaultTasks = [
        {
            id: 'task-1',
            title: 'Complete COS 106 Practical Term Project Submission',
            course: 'COS 106',
            dueDate: '2026-10-30',
            priority: 'high',
            completed: false,
            createdAt: Date.now() - 36000000
        },
        {
            id: 'task-2',
            title: 'Study COS 101 Problem Solving & Pseudocode Logic',
            course: 'COS 101',
            dueDate: '2026-11-04',
            priority: 'medium',
            completed: true,
            createdAt: Date.now() - 72000000
        },
        {
            id: 'task-3',
            title: 'Build Responsive CSS Grid Layout for Web Lab',
            course: 'COS 106',
            dueDate: '2026-10-28',
            priority: 'high',
            completed: true,
            createdAt: Date.now() - 108000000
        },
        {
            id: 'task-4',
            title: 'Review Elementary Mathematics Calculus Problems',
            course: 'MTH 101',
            dueDate: '2026-11-12',
            priority: 'low',
            completed: false,
            createdAt: Date.now() - 144000000
        }
    ];

    let tasks = [];
    let currentFilter = 'all';

    let taskForm;
    let taskTitleInput;
    let taskCourseInput;
    let taskDueDateInput;
    let taskPriorityInput;
    let tasksListEl;
    let emptyStateEl;

    let statTotalEl;
    let statPendingEl;
    let statCompletedEl;
    let statRateEl;

    document.addEventListener('DOMContentLoaded', () => {
        initPlanner();
    });

    function initPlanner() {
        taskForm = document.getElementById('taskForm');
        taskTitleInput = document.getElementById('taskTitle');
        taskCourseInput = document.getElementById('taskCourse');
        taskDueDateInput = document.getElementById('taskDueDate');
        taskPriorityInput = document.getElementById('taskPriority');
        tasksListEl = document.getElementById('tasksList');
        emptyStateEl = document.getElementById('tasksEmptyState');

        statTotalEl = document.getElementById('statTotal');
        statPendingEl = document.getElementById('statPending');
        statCompletedEl = document.getElementById('statCompleted');
        statRateEl = document.getElementById('statRate');

        if (!taskForm || !tasksListEl) return;

        if (taskDueDateInput) {
            const today = new Date().toISOString().split('T')[0];
            taskDueDateInput.min = today;
            taskDueDateInput.value = today;
        }

        loadTasks();

        taskForm.addEventListener('submit', handleAddTask);

        const filterBtns = document.querySelectorAll('.task-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter') || 'all';
                renderTasks();
            });
        });

        renderTasks();
        updateStats();
    }

    function loadTasks() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                tasks = JSON.parse(saved);
            } else {
                tasks = [...defaultTasks];
                saveTasks();
            }
        } catch (err) {
            console.error('Error loading tasks:', err);
            tasks = [...defaultTasks];
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (err) {
            console.error('Error saving tasks:', err);
        }
    }

    function handleAddTask(e) {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const course = taskCourseInput.value;
        const dueDate = taskDueDateInput.value;
        const priority = taskPriorityInput.value;

        if (!title) {
            if (typeof showToast === 'function') {
                showToast('Please enter a task title', 'error');
            }
            taskTitleInput.focus();
            return;
        }

        const newTask = {
            id: 'task-' + Date.now(),
            title: title,
            course: course || 'COS 106',
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            priority: priority || 'medium',
            completed: false,
            createdAt: Date.now()
        };

        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateStats();

        taskTitleInput.value = '';
        taskTitleInput.focus();

        if (typeof showToast === 'function') {
            showToast('Academic task added successfully!', 'success');
        }
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();

        if (typeof showToast === 'function') {
            const msg = task.completed ? 'Task marked as completed! 🎉' : 'Task restored to pending';
            showToast(msg, 'success');
        }
    }

    function deleteTask(id) {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return;

        const removed = tasks.splice(taskIndex, 1)[0];
        saveTasks();
        renderTasks();
        updateStats();

        if (typeof showToast === 'function') {
            showToast(`Deleted task: "${removed.title.substring(0, 24)}..."`, 'info');
        }
    }

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        if (statTotalEl) statTotalEl.textContent = total;
        if (statPendingEl) statPendingEl.textContent = pending;
        if (statCompletedEl) statCompletedEl.textContent = completed;
        if (statRateEl) statRateEl.textContent = `${rate}%`;
    }

    function renderTasks() {
        if (!tasksListEl) return;

        let filteredTasks = tasks;
        if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        tasksListEl.innerHTML = '';

        if (filteredTasks.length === 0) {
            if (emptyStateEl) emptyStateEl.style.display = 'block';
            return;
        }

        if (emptyStateEl) emptyStateEl.style.display = 'none';

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);

            const dateObj = new Date(task.dueDate + 'T00:00:00');
            const formattedDate = !isNaN(dateObj) ? dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }) : task.dueDate;

            li.innerHTML = `
                <button type="button" class="task-checkbox-btn" aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
                    <i class="fa-solid fa-check"></i>
                </button>
                <div class="task-body">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <div class="task-meta-row">
                        <span class="task-course-tag">${escapeHtml(task.course)}</span>
                        <span class="task-date"><i class="fa-regular fa-calendar"></i> ${formattedDate}</span>
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                    </div>
                </div>
                <button type="button" class="task-delete-btn" aria-label="Delete task">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            const checkboxBtn = li.querySelector('.task-checkbox-btn');
            checkboxBtn.addEventListener('click', () => toggleTask(task.id));

            const deleteBtn = li.querySelector('.task-delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            tasksListEl.appendChild(li);
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }
})();
