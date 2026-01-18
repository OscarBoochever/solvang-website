'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MenuItem {
  id: string
  label: string
  url: string
  children?: MenuItem[]
}

interface MenuData {
  items: MenuItem[]
}

export default function MenuManager() {
  const [menu, setMenu] = useState<MenuData>({ items: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<{ parentId: string | null; itemId: string } | null>(null)
  const [editForm, setEditForm] = useState({ label: '', url: '' })
  const [hasChanges, setHasChanges] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/check')
      .then(res => {
        if (!res.ok) router.push('/admin')
        else loadMenu()
      })
      .catch(() => router.push('/admin'))
  }, [router])

  const loadMenu = async () => {
    const res = await fetch('/api/menu')
    const data = await res.json()
    setMenu(data)
    setLoading(false)
  }

  const [saveError, setSaveError] = useState<string | null>(null)

  const saveMenuToServer = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
      })

      // Handle empty or invalid response
      const text = await res.text()
      let data
      try {
        data = text ? JSON.parse(text) : { error: 'Empty response from server' }
      } catch {
        data = { error: `Invalid response: ${text.slice(0, 100)}` }
      }

      if (!res.ok) {
        setSaveError(data.error || data.details || 'Failed to save')
        console.error('Save error:', data)
      } else {
        setHasChanges(false)
      }
    } catch (err: any) {
      setSaveError(err.message || 'Network error')
      console.error('Save error:', err)
    }
    setSaving(false)
  }

  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const addTopLevelItem = () => {
    const newItem: MenuItem = {
      id: generateId(),
      label: 'New Menu Item',
      url: '/',
      children: [],
    }
    setMenu({ items: [...menu.items, newItem] })
    setHasChanges(true)
    // Auto-open edit mode for the new item
    setEditingItem({ parentId: null, itemId: newItem.id })
    setEditForm({ label: newItem.label, url: newItem.url })
  }

  const addSubItem = (parentId: string) => {
    const newItem: MenuItem = {
      id: generateId(),
      label: 'New Sub Item',
      url: '/',
    }
    setMenu({
      items: menu.items.map(item => {
        if (item.id === parentId) {
          return { ...item, children: [...(item.children || []), newItem] }
        }
        return item
      }),
    })
    setHasChanges(true)
    // Auto-open edit mode for the new item
    setEditingItem({ parentId, itemId: newItem.id })
    setEditForm({ label: newItem.label, url: newItem.url })
  }

  const startEditing = (parentId: string | null, item: MenuItem) => {
    setEditingItem({ parentId, itemId: item.id })
    setEditForm({ label: item.label, url: item.url })
  }

  const saveEdit = () => {
    if (!editingItem) return

    if (editingItem.parentId === null) {
      // Editing top-level item
      setMenu({
        items: menu.items.map(item => {
          if (item.id === editingItem.itemId) {
            return { ...item, label: editForm.label, url: editForm.url }
          }
          return item
        }),
      })
    } else {
      // Editing sub-item
      setMenu({
        items: menu.items.map(item => {
          if (item.id === editingItem.parentId) {
            return {
              ...item,
              children: (item.children || []).map(child => {
                if (child.id === editingItem.itemId) {
                  return { ...child, label: editForm.label, url: editForm.url }
                }
                return child
              }),
            }
          }
          return item
        }),
      })
    }
    setEditingItem(null)
    setHasChanges(true)
  }

  const cancelEdit = () => {
    setEditingItem(null)
  }

  const deleteItem = (parentId: string | null, itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    if (parentId === null) {
      setMenu({ items: menu.items.filter(item => item.id !== itemId) })
    } else {
      setMenu({
        items: menu.items.map(item => {
          if (item.id === parentId) {
            return { ...item, children: (item.children || []).filter(child => child.id !== itemId) }
          }
          return item
        }),
      })
    }
    setHasChanges(true)
  }

  const moveItem = (parentId: string | null, itemId: string, direction: 'up' | 'down') => {
    if (parentId === null) {
      const index = menu.items.findIndex(item => item.id === itemId)
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === menu.items.length - 1)) return

      const newItems = [...menu.items]
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      ;[newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]]
      setMenu({ items: newItems })
    } else {
      setMenu({
        items: menu.items.map(item => {
          if (item.id === parentId && item.children) {
            const index = item.children.findIndex(child => child.id === itemId)
            if ((direction === 'up' && index === 0) || (direction === 'down' && index === item.children.length - 1)) return item

            const newChildren = [...item.children]
            const swapIndex = direction === 'up' ? index - 1 : index + 1
            ;[newChildren[index], newChildren[swapIndex]] = [newChildren[swapIndex], newChildren[index]]
            return { ...item, children: newChildren }
          }
          return item
        }),
      })
    }
    setHasChanges(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-white/60 hover:text-white">
              ← Back
            </Link>
            <h1 className="font-bold">Menu Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            {saveError && (
              <span className="text-red-400 text-sm">Error: {saveError}</span>
            )}
            {hasChanges && !saveError && (
              <span className="text-gold-400 text-sm">Unsaved changes</span>
            )}
            <button
              onClick={saveMenuToServer}
              disabled={saving || !hasChanges}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Navigation Menu</h2>
              <p className="text-sm text-gray-500">Add, edit, and reorder menu items</p>
            </div>
            <button
              onClick={addTopLevelItem}
              className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Add Menu Item
            </button>
          </div>

          {menu.items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No menu items. Click "Add Menu Item" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {menu.items.map((item, index) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  {/* Top-level item */}
                  <div className="bg-gray-50 p-4">
                    {editingItem?.itemId === item.id && editingItem?.parentId === null ? (
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                          <input
                            type="text"
                            value={editForm.label}
                            onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            autoFocus
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                          <input
                            type="text"
                            value={editForm.url}
                            onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-800">{item.label}</span>
                          <span className="text-gray-400 text-sm ml-2">{item.url}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveItem(null, item.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move up"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveItem(null, item.id, 'down')}
                            disabled={index === menu.items.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move down"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => startEditing(null, item)}
                            className="px-2 py-1 text-navy-600 hover:bg-navy-50 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(null, item.id)}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sub-items */}
                  <div className="border-t">
                    {(item.children || []).map((child, childIndex) => (
                      <div key={child.id} className="p-3 pl-8 border-b last:border-b-0 bg-white">
                        {editingItem?.itemId === child.id && editingItem?.parentId === item.id ? (
                          <div className="flex gap-3 items-end">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                              <input
                                type="text"
                                value={editForm.label}
                                onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                autoFocus
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                              <input
                                type="text"
                                value={editForm.url}
                                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                              />
                            </div>
                            <button
                              onClick={saveEdit}
                              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-2">↳</span>
                              <span className="text-gray-700">{child.label}</span>
                              <span className="text-gray-400 text-sm ml-2">{child.url}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveItem(item.id, child.id, 'up')}
                                disabled={childIndex === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                title="Move up"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveItem(item.id, child.id, 'down')}
                                disabled={childIndex === (item.children?.length || 0) - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                title="Move down"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => startEditing(item.id, child)}
                                className="px-2 py-1 text-navy-600 hover:bg-navy-50 rounded text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteItem(item.id, child.id)}
                                className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addSubItem(item.id)}
                      className="w-full p-2 pl-8 text-left text-sm text-navy-600 hover:bg-navy-50 transition-colors"
                    >
                      + Add sub-item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use anchor links like <code className="bg-blue-100 px-1 rounded">/page#section</code> to link to page sections</li>
              <li>• External links should start with <code className="bg-blue-100 px-1 rounded">https://</code></li>
              <li>• Changes are saved when you click "Save Changes"</li>
              <li>• The menu updates on the live site after saving</li>
            </ul>
          </div>

          {/* Bottom Save Button */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t">
            {saveError ? (
              <span className="text-red-600 text-sm">Error: {saveError}</span>
            ) : hasChanges ? (
              <span className="text-amber-600 text-sm">You have unsaved changes</span>
            ) : (
              <span />
            )}
            <button
              onClick={saveMenuToServer}
              disabled={saving || !hasChanges}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
