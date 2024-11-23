'use server'

import { revalidatePath } from 'next/cache'

// This is a mock database. In a real application, you'd use a proper database.
let industries: { id: string; name: string }[] = []

export async function addIndustry(formData: FormData) {
  const name = formData.get('name') as string

  if (!name) {
    return { error: 'Industry name is required' }
  }

  const id = Date.now().toString() // In a real app, use a proper ID generation method
  industries.push({ id, name })

  revalidatePath('/admin/industry')
  return { success: true }
}

export async function getIndustries() {
  return industries
}

export async function updateIndustry(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string

  if (!id || !name) {
    return { error: 'Industry ID and name are required' }
  }

  const index = industries.findIndex(industry => industry.id === id)
  if (index === -1) {
    return { error: 'Industry not found' }
  }

  industries[index] = { id, name }

  revalidatePath('/admin/industry')
  return { success: true }
}

export async function deleteIndustry(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    return { error: 'Industry ID is required' }
  }

  industries = industries.filter(industry => industry.id !== id)

  revalidatePath('/admin/industry')
  return { success: true }
}

