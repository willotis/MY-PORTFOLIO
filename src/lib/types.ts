// Database types matching our Supabase schema
export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string
  cv_url: string
  cv_visible: boolean
  availability_employment: boolean
  availability_freelance: boolean
  availability_collaboration: boolean
  email: string
  phone: string
  location: string
  linkedin_url: string
  github_url: string
  twitter_url: string
  website_url: string
  whatsapp: string
  tagline: string
  updated_at: string
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  category: string
  cover_image: string
  screenshots: string[]
  videos: string[]
  tech_tags: string[]
  status: string
  featured: boolean
  published: boolean
  github_url: string
  demo_url: string
  sort_order: number
  problem: string
  solution: string
  role: string
  journey: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  category: string
  name: string
  sort_order: number
}

export interface Media {
  id: string
  url: string
  type: 'image' | 'video'
  caption: string
  description: string
  category: string
  featured: boolean
  created_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  archived: boolean
  created_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  start_date: string
  end_date: string
  description: string
  type: string
  sort_order: number
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  start_year: string
  end_year: string
  sort_order: number
}

export interface Certification {
  id: string
  name: string
  issuer: string
  year: string
  url: string
  sort_order: number
}
