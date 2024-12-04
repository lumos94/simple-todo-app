<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl">
      <div class="flex flex-col justify-center items-center gap-y-10 pt-10">
        <h1 class="text-2xl font-bold  text-center">2do List</h1>
        <div class="flex flex-row gap-3 items-center justify-center">
          <div class="relative">
            <input
                id="task"
                v-model="newTask"
                @keyup.enter="addTask"
                type="text"
                required
                name="task"
                placeholder="Task's Description"
                class="peer h-10 w-full min-w-[200px] text-gray-900 placeholder-transparent focus:outline-none rounded-md border-0 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
            />
            <label
                for="task"
                class="absolute left-0 -top-5 text-gray-600 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-gray-600 peer-focus:text-sm pl-2"
            >
              Add a new task
            </label>
          </div>
          <button
              @click="addTask"
              :disabled="!newTask"
              class="w-full py-2 px-2 text-white text-center font-semibold rounded-md cursor-pointer"
              :class="[newTask ? 'bg-green-600' : 'bg-green-100']"
          >
            <PlusCircleIcon class="size-6 text-white text-center"/>
          </button>
        </div>

        <div class="flex w-full gap-x-5 justify-center">
          <button
              @click="filterTasks('all')"
              :class="['px-4 py-2 rounded-md', filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200']"
          >
            All
          </button>
          <button
              @click="filterTasks('completed')"
              :class="['px-4 py-2 rounded-md', filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200']"
          >
            Completed
          </button>
          <button
              @click="filterTasks('active')"
              :class="['px-4 py-2 rounded-md', filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200']"
          >
            Active
          </button>
        </div>
        <div
            class="w-full max-w-3xl scrollable-container overflow-y-auto max-h-96 p-4 bg-gray-100 rounded-lg shadow-md">
          <table class="min-w-full divide-y divide-gray-300 ">
            <thead>
            <tr>
              <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">#</th>
              <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Task Name</th>
              <th class="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(task, index) in filteredTasks"
                :key="task.id"
                :class="[task.completed ? 'bg-green-100' : 'even:bg-gray-50']"
            >
              <td class="font-bold py-4 pl-4 pr-3 text-sm">{{ index + 1 }}</td>
              <td class="py-4 pl-4 pr-3 text-sm  text-gray-900">
                <template v-if="task.isEditing">
                  <input
                      v-model="task.text"
                      type="text"
                      class="w-full rounded-md border-gray-300 focus:ring-indigo-500"
                  />
                </template>
                <template v-else>
                  <span :class="{ 'line-through text-gray-500': task.completed }">{{ task.text }}</span>
                </template>
              </td>
              <td class="text-right py-4 pl-4 pr-3">
                <div class="space-x-2">
                  <button
                      @click="toggleEditing(task)"

                  >
                    <template v-if="!task.isEditing">
                      <PencilSquareIcon class="size-6 text-yellow-500"/>
                    </template>
                    <template v-else>
                      <XMarkIcon class="size-6 text-red-500"/>
                    </template>
                  </button>
                  <button
                      @click="toggleCompletion(task)"
                      class="  text-green-600 rounded-md"
                  >
                    <CheckCircleIcon v-if="!task.completed" class="size-6"/>
                    <ArrowPathIcon v-if="task.completed" class="size-6"/>
                  </button>
                  <button
                      @click="deleteTask(task)"
                      class="  text-red-500"
                  >
                    <MinusCircleIcon class="size-6"/>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTasks.length <=0">
              <td colspan="3" class="text-red-600 text-center">No Tasks</td>
            </tr>
            </tbody>
          </table>
        </div>
        <button
            @click="applyChanges"
            class="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Apply Changes
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, ref} from 'vue';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const newTask = ref('');
const tasks = ref(
    JSON.parse(localStorage.getItem('tasks')) || []
);
const filter = ref('all');

const filteredTasks = computed(() => {
  if (filter.value === 'completed') return tasks.value.filter((task) => task.completed);
  if (filter.value === 'active') return tasks.value.filter((task) => !task.completed);
  return tasks.value;
});

const addTask = () => {
  if (!newTask.value.trim()) return;
  tasks.value.push({
    id: Date.now(),
    text: newTask.value,
    completed: false,
    isEditing: false,
  });
  newTask.value = '';
  saveTasks();
};

const toggleCompletion = (task) => {
  task.completed = !task.completed;
  saveTasks();
};

const deleteTask = (task) => {
  tasks.value = tasks.value.filter((t) => t.id !== task.id);
  saveTasks();
};

const toggleEditing = (task) => {
  task.isEditing = !task.isEditing;
};

const applyChanges = () => {
  tasks.value.forEach((task) => (task.isEditing = false));
  saveTasks();
};

const filterTasks = (status) => (filter.value = status);

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
}
</script>

<style scoped>
/* Custom scrollbar styles */
.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #e5e7eb;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 4px;
  border: 2px solid #f3f4f6;
}

/* Firefox scrollbar styling */
.scrollable-container {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #e5e7eb;
}

</style>
