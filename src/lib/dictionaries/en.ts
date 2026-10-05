export type Dictionary = {
  common: {
    loading: string;
    error: string;
    retry: string;
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    back: string;
    close: string;
    search: string;
    noResults: string;
    status: string;
    role: string;
    actions: string;
    all: string;
  };
  auth: {
    login: {
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      forgotPassword: string;
      noAccount: string;
      signUp: string;
      errors: {
        invalidCredentials: string;
        tooManyAttempts: string;
        serverError: string;
        emailRequired: string;
        emailInvalid: string;
        passwordRequired: string;
        passwordMinLength: string;
      };
    };
    register: {
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      hasAccount: string;
      signIn: string;
      successToast: string;
      errors: {
        nameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        passwordRequired: string;
        passwordMinLength: string;
        passwordMismatch: string;
      };
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      backToLogin: string;
      successMessage: string;
      errors: {
        emailRequired: string;
        emailInvalid: string;
      };
    };
    logout: {
      button: string;
      success: string;
    };
  };
  dashboard: {
    title: string;
    welcome: string;
    navigation: {
      dashboard: string;
      users: string;
      profile: string;
      settings: string;
    };
  };
  profile: {
    title: string;
    subtitle: string;
    personalInfoTitle: string;
    personalInfoDescription: string;
    nameLabel: string;
    emailLabel: string;
    roleLabel: string;
    saveChanges: string;
    saving: string;
    changePasswordTitle: string;
    changePasswordDescription: string;
    currentPasswordLabel: string;
    newPasswordLabel: string;
    confirmPasswordLabel: string;
    updatePassword: string;
    updatingPassword: string;
    profileUpdated: string;
    passwordUpdated: string;
  };
  users: {
    title: string;
    subtitle: string;
    addNewUser: string;
    searchPlaceholder: string;
    filterRole: string;
    filterStatus: string;
    allRoles: string;
    allStatuses: string;
    columns: {
      name: string;
      email: string;
      role: string;
      status: string;
      createdAt: string;
      actions: string;
    };
    roles: {
      admin: string;
      moderator: string;
      user: string;
    };
    statuses: {
      active: string;
      inactive: string;
    };
    pagination: {
      showing: string;
      of: string;
      page: string;
      prev: string;
      next: string;
      perPage: string;
    };
    dialog: {
      createTitle: string;
      createDescription: string;
      editTitle: string;
      editDescription: string;
      nameLabel: string;
      emailLabel: string;
      roleLabel: string;
      statusLabel: string;
      submitCreate: string;
      submitEdit: string;
      deleteTitle: string;
      deleteDescription: string;
      deleteConfirm: string;
    };
    toasts: {
      created: string;
      updated: string;
      deleted: string;
    };
  };
  rbac: {
    accessDenied: string;
    unauthorizedRoleMessage: string;
  };
  errors: {
    notFound: {
      title: string;
      description: string;
      backHome: string;
    };
    serverError: {
      title: string;
      description: string;
      retry: string;
    };
  };
};

export const en: Dictionary = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Try again',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    close: 'Close',
    search: 'Search',
    noResults: 'No results found',
    status: 'Status',
    role: 'Role',
    actions: 'Actions',
    all: 'All',
  },
  auth: {
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to your account to continue',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitButton: 'Sign in',
      submittingButton: 'Signing in...',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      errors: {
        invalidCredentials: 'Invalid email or password.',
        tooManyAttempts: 'Too many attempts. Please try again later.',
        serverError: 'Something went wrong. Please try again.',
        emailRequired: 'Email is required.',
        emailInvalid: 'Please enter a valid email address.',
        passwordRequired: 'Password is required.',
        passwordMinLength: 'Password must be at least 8 characters.',
      },
    },
    register: {
      title: 'Create an account',
      subtitle: 'Sign up to get started with your workspace',
      nameLabel: 'Full name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Confirm password',
      confirmPasswordPlaceholder: '••••••••',
      submitButton: 'Create account',
      submittingButton: 'Creating account...',
      hasAccount: 'Already have an account?',
      signIn: 'Sign in',
      successToast: 'Account created successfully! Please sign in.',
      errors: {
        nameRequired: 'Full name is required.',
        emailRequired: 'Email is required.',
        emailInvalid: 'Please enter a valid email address.',
        passwordRequired: 'Password is required.',
        passwordMinLength: 'Password must be at least 8 characters.',
        passwordMismatch: 'Passwords do not match.',
      },
    },
    forgotPassword: {
      title: 'Reset your password',
      subtitle: 'Enter your email and we will send you a reset link',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      submitButton: 'Send reset instructions',
      submittingButton: 'Sending...',
      backToLogin: 'Back to sign in',
      successMessage: 'If an account exists with that email, reset instructions have been sent.',
      errors: {
        emailRequired: 'Email is required.',
        emailInvalid: 'Please enter a valid email address.',
      },
    },
    logout: {
      button: 'Sign out',
      success: 'You have been signed out.',
    },
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back, {name}!',
    navigation: {
      dashboard: 'Dashboard',
      users: 'Users Management',
      profile: 'Profile',
      settings: 'Settings',
    },
  },
  profile: {
    title: 'Profile Settings',
    subtitle: 'Manage your personal information and security credentials',
    personalInfoTitle: 'Personal Information',
    personalInfoDescription: 'Update your display name and email address',
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    roleLabel: 'Current Role',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    changePasswordTitle: 'Security & Password',
    changePasswordDescription: 'Ensure your account is using a secure password',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updatePassword: 'Update Password',
    updatingPassword: 'Updating...',
    profileUpdated: 'Profile information updated successfully.',
    passwordUpdated: 'Password changed successfully.',
  },
  users: {
    title: 'Users Management',
    subtitle: 'Manage team members, permissions, and account statuses',
    addNewUser: 'Add New User',
    searchPlaceholder: 'Search by name or email...',
    filterRole: 'Filter by Role',
    filterStatus: 'Filter by Status',
    allRoles: 'All Roles',
    allStatuses: 'All Statuses',
    columns: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      createdAt: 'Joined At',
      actions: 'Actions',
    },
    roles: {
      admin: 'Admin',
      moderator: 'Moderator',
      user: 'User',
    },
    statuses: {
      active: 'Active',
      inactive: 'Inactive',
    },
    pagination: {
      showing: 'Showing',
      of: 'of',
      page: 'Page',
      prev: 'Previous',
      next: 'Next',
      perPage: 'per page',
    },
    dialog: {
      createTitle: 'Create New User',
      createDescription: 'Add a new member to your workspace with designated role.',
      editTitle: 'Edit User',
      editDescription: 'Update member profile details, role, or active status.',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      roleLabel: 'Role',
      statusLabel: 'Account Status',
      submitCreate: 'Create User',
      submitEdit: 'Save Changes',
      deleteTitle: 'Are you absolutely sure?',
      deleteDescription: 'This action cannot be undone. The user account will be permanently deleted.',
      deleteConfirm: 'Delete User',
    },
    toasts: {
      created: 'User successfully created.',
      updated: 'User successfully updated.',
      deleted: 'User successfully deleted.',
    },
  },
  rbac: {
    accessDenied: 'Access Restricted',
    unauthorizedRoleMessage: 'You do not have permission to view or manage this section.',
  },
  errors: {
    notFound: {
      title: 'Page not found',
      description: "The page you're looking for doesn't exist.",
      backHome: 'Back to home',
    },
    serverError: {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.',
      retry: 'Try again',
    },
  },
};
