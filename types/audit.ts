export interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    fullName: string
    id: string
  }
  
  export interface AuditTrail {
    _id: string
    action: "CREATE" | "UPDATE" | "DELETE" | "REMOVE" | "LOGIN" | "LOGOUT" | string
    userId: User
    module: "INVENTORY" | "USER" | "ORDER" | "PRODUCT" | "PAYMENT" | string
    description: string
    changes: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export interface AuditTrailFilters {
    action: string | null
    module: string | null
    user: string | null
    dateRange: [Date | null, Date | null]
    searchQuery: string
  }
  