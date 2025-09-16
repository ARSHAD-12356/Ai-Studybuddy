interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

class AuthService {
  private readonly USERS_KEY = "study_app_users"
  private readonly SESSION_KEY = "study_app_session"

  // Hash password (simple implementation for demo)
  private hashPassword(password: string): string {
    // In a real app, use proper hashing like bcrypt
    return btoa(password + "salt_key_study_app")
  }

  // Verify password
  private verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword
  }

  // Generate session token
  private generateToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36)
  }

  // Get all users
  private getUsers(): Array<User & { password: string }> {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]")
    } catch {
      return []
    }
  }

  // Save users
  private saveUsers(users: Array<User & { password: string }>): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  // Register new user
  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const users = this.getUsers()

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        return { success: false, error: "User with this email already exists" }
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email,
        name,
        password: this.hashPassword(password),
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      this.saveUsers(users)

      // Create session
      const { password: _, ...userWithoutPassword } = newUser
      this.createSession(userWithoutPassword)

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const users = this.getUsers()
      const user = users.find((u) => u.email === email)

      if (!user || !this.verifyPassword(password, user.password)) {
        return { success: false, error: "Invalid email or password" }
      }

      // Create session
      const { password: _, ...userWithoutPassword } = user
      this.createSession(userWithoutPassword)

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  // Create session
  private createSession(user: User): void {
    const session: AuthSession = {
      user,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
  }

  // Get current session
  getCurrentSession(): AuthSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return null

      const session: AuthSession = JSON.parse(sessionData)

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        this.logout()
        return null
      }

      return session
    } catch {
      return null
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const session = this.getCurrentSession()
    return session?.user || null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY)
  }

  // Update user profile
  async updateProfile(
    updates: Partial<Pick<User, "name" | "email">>,
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const session = this.getCurrentSession()
      if (!session) return { success: false, error: "Not authenticated" }

      const users = this.getUsers()
      const userIndex = users.findIndex((u) => u.id === session.user.id)

      if (userIndex === -1) return { success: false, error: "User not found" }

      // Update user
      users[userIndex] = { ...users[userIndex], ...updates }
      this.saveUsers(users)

      // Update session
      const updatedUser = { ...session.user, ...updates }
      this.createSession(updatedUser)

      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, error: "Profile update failed" }
    }
  }
}

export const authService = new AuthService()
