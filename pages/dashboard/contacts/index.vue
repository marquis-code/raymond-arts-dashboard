<template>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Contacts Management</h1>
          <p class="text-gray-500 mt-1">Manage your customers, collectors, and business contacts</p>
        </div>
        <div class="flex gap-3">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search contacts..." 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button @click="isAddContactModalOpen = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            <Plus class="h-4 w-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>
  
      <!-- Contact Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
            <select id="type-filter" v-model="filters.type" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Types</option>
              <option value="customer">Customer</option>
              <option value="collector">Collector</option>
              <option value="gallery">Gallery</option>
              <option value="supplier">Supplier</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select id="sort-by" v-model="filters.sortBy" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="date-asc">Date Added (Oldest)</option>
              <option value="date-desc">Date Added (Newest)</option>
            </select>
          </div>
          <div>
            <label for="tag-filter" class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <select id="tag-filter" v-model="filters.tag" class="w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
              <option value="all">All Tags</option>
              <option value="vip">VIP</option>
              <option value="repeat">Repeat Customer</option>
              <option value="new">New Contact</option>
              <option value="lead">Lead</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="resetFilters" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            Reset
          </button>
          <button @click="applyFilters" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
            Apply Filters
          </button>
        </div>
      </div>
  
      <!-- Contacts Grid/List View Toggle -->
      <div class="flex justify-end">
        <div class="inline-flex rounded-md shadow-sm">
          <button 
            @click="viewMode = 'grid'" 
            class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            :class="viewMode === 'grid' ? 'text-violet-700 bg-violet-50' : 'text-gray-700 hover:bg-gray-50'"
          >
            <Grid class="h-4 w-4" />
          </button>
          <button 
            @click="viewMode = 'list'" 
            class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            :class="viewMode === 'list' ? 'text-violet-700 bg-violet-50' : 'text-gray-700 hover:bg-gray-50'"
          >
            <List class="h-4 w-4" />
          </button>
        </div>
      </div>
  
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="contact in filteredContacts" :key="contact.id" class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex items-center">
                <div class="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img :src="contact.avatar" :alt="contact.name" class="h-full w-full object-cover" />
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">{{ contact.name }}</h3>
                  <p class="text-sm text-gray-500">{{ contact.type }}</p>
                </div>
              </div>
              <div class="flex space-x-1">
                <button @click="editContact(contact)" class="text-gray-400 hover:text-gray-500">
                  <Edit class="h-5 w-5" />
                </button>
                <button @click="deleteContact(contact)" class="text-gray-400 hover:text-red-500">
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div class="mt-4 space-y-2">
              <div v-if="contact.email" class="flex items-center text-sm">
                <Mail class="h-4 w-4 text-gray-400 mr-2" />
                <span class="text-gray-600">{{ contact.email }}</span>
              </div>
              <div v-if="contact.phone" class="flex items-center text-sm">
                <Phone class="h-4 w-4 text-gray-400 mr-2" />
                <span class="text-gray-600">{{ contact.phone }}</span>
              </div>
              <div v-if="contact.address" class="flex items-center text-sm">
                <MapPin class="h-4 w-4 text-gray-400 mr-2" />
                <span class="text-gray-600">{{ contact.address }}</span>
              </div>
            </div>
            
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="(tag, tagIndex) in contact.tags" :key="tagIndex" 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-violet-100 text-violet-800': tag === 'vip',
                  'bg-green-100 text-green-800': tag === 'repeat',
                  'bg-blue-100 text-blue-800': tag === 'new',
                  'bg-yellow-100 text-yellow-800': tag === 'lead'
                }">
                {{ tag }}
              </span>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex justify-between">
                <span class="text-xs text-gray-500">Added: {{ contact.dateAdded }}</span>
                <button @click="viewContactDetails(contact)" class="text-sm font-medium text-violet-600 hover:text-violet-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="contact in filteredContacts" :key="contact.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img :src="contact.avatar" :alt="contact.name" class="h-10 w-10 rounded-full object-cover" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ contact.name }}</div>
                      <div class="text-xs text-gray-500">Added: {{ contact.dateAdded }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ contact.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ contact.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ contact.phone }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="(tag, tagIndex) in contact.tags" :key="tagIndex" 
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-violet-100 text-violet-800': tag === 'vip',
                        'bg-green-100 text-green-800': tag === 'repeat',
                        'bg-blue-100 text-blue-800': tag === 'new',
                        'bg-yellow-100 text-yellow-800': tag === 'lead'
                      }">
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="viewContactDetails(contact)" class="text-violet-600 hover:text-violet-900">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="editContact(contact)" class="text-blue-600 hover:text-blue-900">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="deleteContact(contact)" class="text-red-600 hover:text-red-900">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ contacts.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-violet-50 text-sm font-medium text-violet-600 hover:bg-violet-100">
                  1
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Contact Modal -->
      <div v-if="isAddContactModalOpen || isEditContactModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ isEditContactModalOpen ? 'Edit Contact' : 'Add New Contact' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="contact-name" class="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" id="contact-name" v-model="currentContact.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="contact-type" class="block text-sm font-medium text-gray-700">Contact Type</label>
                      <select id="contact-type" v-model="currentContact.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]">
                        <option value="customer">Customer</option>
                        <option value="collector">Collector</option>
                        <option value="gallery">Gallery</option>
                        <option value="supplier">Supplier</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label for="contact-email" class="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" id="contact-email" v-model="currentContact.email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="contact-phone" class="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="tel" id="contact-phone" v-model="currentContact.phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]" />
                    </div>
                    <div>
                      <label for="contact-address" class="block text-sm font-medium text-gray-700">Address</label>
                      <textarea id="contact-address" v-model="currentContact.address" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <div class="flex flex-wrap gap-2">
                        <button 
                          v-for="tag in availableTags" 
                          :key="tag"
                          @click="toggleTag(tag)"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="{
                            'bg-violet-100 text-violet-800 border-2 border-violet-300': currentContact.tags.includes(tag) && tag === 'vip',
                            'bg-green-100 text-green-800 border-2 border-green-300': currentContact.tags.includes(tag) && tag === 'repeat',
                            'bg-blue-100 text-blue-800 border-2 border-blue-300': currentContact.tags.includes(tag) && tag === 'new',
                            'bg-yellow-100 text-yellow-800 border-2 border-yellow-300': currentContact.tags.includes(tag) && tag === 'lead',
                            'bg-gray-100 text-gray-800': !currentContact.tags.includes(tag)
                          }"
                        >
                          {{ tag }}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label for="contact-notes" class="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea id="contact-notes" v-model="currentContact.notes" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 transition-all duration-200 p-3 outline-none border-[0.5px]"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="saveContact" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:ml-3 sm:w-auto sm:text-sm">
                {{ isEditContactModalOpen ? 'Update Contact' : 'Add Contact' }}
              </button>
              <button @click="closeContactModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- View Contact Details Modal -->
      <div v-if="selectedContact" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      Contact Details
                    </h3>
                    <div class="flex space-x-2">
                      <button @click="editContact(selectedContact)" class="text-blue-600 hover:text-blue-900">
                        <Edit class="h-4 w-4" />
                      </button>
                      <button @click="deleteContact(selectedContact)" class="text-red-600 hover:text-red-900">
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex items-center mb-6">
                    <div class="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img :src="selectedContact.avatar" :alt="selectedContact.name" class="h-full w-full object-cover" />
                    </div>
                    <div class="ml-4">
                      <h3 class="text-xl font-medium text-gray-900">{{ selectedContact.name }}</h3>
                      <p class="text-sm text-gray-500">{{ selectedContact.type }}</p>
                      <div class="mt-1 flex flex-wrap gap-1">
                        <span v-for="(tag, tagIndex) in selectedContact.tags" :key="tagIndex" 
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          :class="{
                            'bg-violet-100 text-violet-800': tag === 'vip',
                            'bg-green-100 text-green-800': tag === 'repeat',
                            'bg-blue-100 text-blue-800': tag === 'new',
                            'bg-yellow-100 text-yellow-800': tag === 'lead'
                          }">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="border-t border-gray-200 py-4">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Email</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ selectedContact.email }}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Phone</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ selectedContact.phone }}</dd>
                      </div>
                      <div class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500">Address</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ selectedContact.address }}</dd>
                      </div>
                      <div class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500">Notes</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ selectedContact.notes || 'No notes available.' }}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div class="border-t border-gray-200 py-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-3">
                      Recent Activity
                    </h4>
                    <div class="space-y-3">
                      <div v-for="(activity, index) in selectedContact.activity" :key="index" class="flex items-start">
                        <div class="flex-shrink-0">
                          <component :is="getActivityIcon(activity.type)" class="h-5 w-5 text-gray-400" />
                        </div>
                        <div class="ml-3">
                          <p class="text-sm text-gray-900">{{ activity.description }}</p>
                          <p class="text-xs text-gray-500">{{ activity.date }}</p>
                        </div>
                      </div>
                      <div v-if="!selectedContact.activity || selectedContact.activity.length === 0" class="text-sm text-gray-500">
                        No recent activity.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button @click="selectedContact = null" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 sm:mt-0 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { 
    Search, Plus, Eye, Edit, Trash2, Grid, List,
    Mail, Phone, MapPin, ChevronLeft, ChevronRight,
    ShoppingCart, CreditCard, MessageSquare, Calendar
  } from 'lucide-vue-next'
  
  // View mode (grid or list)
  const viewMode = ref('grid')
  
  // Search and filters
  const searchQuery = ref('')
  const filters = ref({
    type: 'all',
    sortBy: 'name-asc',
    tag: 'all'
  })
  
  // Modal states
  const isAddContactModalOpen = ref(false)
  const isEditContactModalOpen = ref(false)
  const selectedContact = ref(null as any)
  
  // Available tags
  const availableTags = ['vip', 'repeat', 'new', 'lead']
  
  // Current contact being edited or created
  const currentContact = ref({
    id: '',
    name: '',
    type: 'customer',
    email: '',
    phone: '',
    address: '',
    tags: [] as string[],
    notes: '',
    avatar: '',
    dateAdded: '',
    activity: [] as any[]
  })
  
  // Sample contacts data
  const contacts = ref([
    {
      id: '1',
      name: 'John Doe',
      type: 'customer',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      tags: ['vip', 'repeat'],
      notes: 'Interested in abstract art and modern sculptures.',
      avatar: 'https://i.pravatar.cc/300?img=1',
      dateAdded: '2025-04-01',
      activity: [
        { type: 'purchase', description: 'Purchased "Abstract Sunset" painting', date: '2025-04-02' },
        { type: 'email', description: 'Sent follow-up email about upcoming exhibition', date: '2025-03-28' },
        { type: 'note', description: 'Expressed interest in commissioning a new piece', date: '2025-03-15' }
      ]
    },
    {
      id: '2',
      name: 'Sarah Smith',
      type: 'collector',
      email: 'sarah.smith@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, San Francisco, CA 94102',
      tags: ['vip'],
      notes: 'Serious collector of contemporary art. Prefers large-scale works.',
      avatar: 'https://i.pravatar.cc/300?img=2',
      dateAdded: '2025-03-20',
      activity: [
        { type: 'purchase', description: 'Purchased "Urban Landscape" photograph', date: '2025-03-25' },
        { type: 'meeting', description: 'Met at the Spring Art Fair', date: '2025-03-10' }
      ]
    },
    {
      id: '3',
      name: 'Michael Johnson',
      type: 'customer',
      email: 'michael.johnson@example.com',
      phone: '(555) 456-7890',
      address: '789 Pine St, Chicago, IL 60601',
      tags: ['new'],
      notes: 'New customer referred by Sarah Smith. Interested in portrait commissions.',
      avatar: 'https://i.pravatar.cc/300?img=3',
      dateAdded: '2025-03-30',
      activity: [
        { type: 'purchase', description: 'Commissioned a portrait', date: '2025-03-30' }
      ]
    },
    {
      id: '4',
      name: 'Art Gallery NYC',
      type: 'gallery',
      email: 'contact@artgallerynyc.com',
      phone: '(555) 234-5678',
      address: '321 Gallery Row, New York, NY 10012',
      tags: ['vip', 'repeat'],
      notes: 'Partnership for quarterly exhibitions. Next show scheduled for June.',
      avatar: 'https://i.pravatar.cc/300?img=4',
      dateAdded: '2024-11-15',
      activity: [
        { type: 'meeting', description: 'Meeting to discuss summer exhibition', date: '2025-03-22' },
        { type: 'email', description: 'Sent exhibition proposal and artwork list', date: '2025-03-15' }
      ]
    },
    {
      id: '5',
      name: 'Emily Williams',
      type: 'customer',
      email: 'emily.williams@example.com',
      phone: '(555) 876-5432',
      address: '654 Elm St, Austin, TX 78701',
      tags: ['repeat'],
      notes: 'Repeat customer who prefers digital art prints.',
      avatar: 'https://i.pravatar.cc/300?img=5',
      dateAdded: '2025-01-10',
      activity: [
        { type: 'purchase', description: 'Purchased "Digital Dreams" artwork', date: '2025-03-29' },
        { type: 'purchase', description: 'Purchased "Abstract Geometry" digital print', date: '2025-02-15' }
      ]
    },
    {
      id: '6',
      name: 'Robert Brown',
      type: 'lead',
      email: 'robert.brown@example.com',
      phone: '(555) 345-6789',
      address: '987 Cedar Ln, Seattle, WA 98101',
      tags: ['lead'],
      notes: 'Potential client interested in commissioning a sculpture.',
      avatar: 'https://i.pravatar.cc/300?img=6',
      dateAdded: '2025-03-25',
      activity: [
        { type: 'email', description: 'Sent portfolio and pricing information', date: '2025-03-26' },
        { type: 'note', description: 'Initial inquiry about bronze sculptures', date: '2025-03-25' }
      ]
    },
    {
      id: '7',
      name: 'Art Supplies Co.',
      type: 'supplier',
      email: 'orders@artsupplies.com',
      phone: '(555) 567-8901',
      address: '753 Supply St, Denver, CO 80201',
      tags: [],
      notes: 'Primary supplier for canvas, paints, and brushes.',
      avatar: 'https://i.pravatar.cc/300?img=7',
      dateAdded: '2024-09-05',
      activity: [
        { type: 'purchase', description: 'Ordered new canvas supplies', date: '2025-03-15' },
        { type: 'email', description: 'Received invoice for last order', date: '2025-03-10' }
      ]
    },
    {
      id: '8',
      name: 'Jennifer Davis',
      type: 'customer',
      email: 'jennifer.davis@example.com',
      phone: '(555) 678-9012',
      address: '159 Maple Ave, Miami, FL 33101',
      tags: ['new', 'lead'],
      notes: 'New customer interested in watercolor landscapes.',
      avatar: 'https://i.pravatar.cc/300?img=8',
      dateAdded: '2025-03-27',
      activity: [
        { type: 'email', description: 'Sent catalog of available watercolor pieces', date: '2025-03-28' },
        { type: 'note', description: 'Initial inquiry through website contact form', date: '2025-03-27' }
      ]
    }
  ])
  
  // Filtered and sorted contacts
  const filteredContacts = computed(() => {
    let result = contacts.value.filter(contact => {
      // Search query
      if (searchQuery.value && !contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
          !contact.email.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false
      }
      
      // Type filter
      if (filters.value.type !== 'all' && contact.type !== filters.value.type) {
        return false
      }
      
      // Tag filter
      if (filters.value.tag !== 'all' && !contact.tags.includes(filters.value.tag)) {
        return false
      }
      
      return true
    })
    
    // Sort the results
    switch (filters.value.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'date-asc':
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        break
      case 'date-desc':
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
    }
    
    return result
  })
  
  // Filter functions
  const resetFilters = () => {
    filters.value = {
      type: 'all',
      sortBy: 'name-asc',
      tag: 'all'
    }
  }
  
  const applyFilters = () => {
    // Filters are already applied via the computed property
  }
  
  // Contact actions
  const viewContactDetails = (contact: any) => {
    selectedContact.value = contact
  }
  
  const editContact = (contact: any) => {
    currentContact.value = JSON.parse(JSON.stringify(contact)) // Deep copy
    isEditContactModalOpen.value = true
  }
  
  const deleteContact = (contact: any) => {
    if (confirm(`Are you sure you want to delete ${contact.name} from contacts?`)) {
      const index = contacts.value.findIndex(c => c.id === contact.id)
      if (index !== -1) {
        contacts.value.splice(index, 1)
      }
      
      // Close the details modal if it's open
      if (selectedContact.value && selectedContact.value.id === contact.id) {
        selectedContact.value = null
      }
    }
  }
  
  // Toggle tag in current contact
  const toggleTag = (tag: string) => {
    const index = currentContact.value.tags.indexOf(tag)
    if (index === -1) {
      currentContact.value.tags.push(tag)
    } else {
      currentContact.value.tags.splice(index, 1)
    }
  }
  
  // Save contact
  const saveContact = () => {
    if (isEditContactModalOpen.value) {
      // Update existing contact
      const index = contacts.value.findIndex(c => c.id === currentContact.value.id)
      if (index !== -1) {
        contacts.value[index] = { ...currentContact.value }
        
        // Update the selected contact if it's open
        if (selectedContact.value && selectedContact.value.id === currentContact.value.id) {
          selectedContact.value = { ...currentContact.value }
        }
      }
    } else {
      // Add new contact
      const newContact = {
        ...currentContact.value,
        id: Date.now().toString(),
        avatar: currentContact.value.avatar || `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`,
        dateAdded: new Date().toISOString().split('T')[0],
        activity: []
      }
      contacts.value.push(newContact)
    }
    closeContactModal()
  }
  
  const closeContactModal = () => {
    isAddContactModalOpen.value = false
    isEditContactModalOpen.value = false
    currentContact.value = {
      id: '',
      name: '',
      type: 'customer',
      email: '',
      phone: '',
      address: '',
      tags: [],
      notes: '',
      avatar: '',
      dateAdded: '',
      activity: []
    }
  }

  definePageMeta({
      layout: 'dashboard'
  })
  
  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return ShoppingCart
      case 'email':
        return Mail
      case 'note':
        return MessageSquare
      case 'meeting':
        return Calendar
      case 'payment':
        return CreditCard
      default:
        return MessageSquare
    }
  }
  </script>