
## Changes to implement based on SRS v2.0 + Multi-Project Management doc

### 1. Registration Page (`/register`)
Update to match SRS 2.1:
- Fields: Name, Email, Phone Number, Password (with validation: min 8 chars, 1 capital, 1 number, 1 special char)
- Password strength indicator
- Terms & Conditions checkbox (required)
- "Email verification sent" confirmation screen after submit
- Auto-detect timezone
- Keep Account Type selection (Agency vs Client/Organization)

### 2. Login Page (`/login`)
Update to match SRS 2.2:
- Email + Password login (already done)
- Add "Forgot Password?" link → opens forgot password flow
- First-time login → redirect to onboarding/connect social accounts
- Subsequent logins → redirect to Dashboard
- Keep demo quick access buttons

### 3. Forgot Password Page (`/forgot-password`)
New page per SRS 2.3:
- Email input field
- "Send Reset Link" button
- Success confirmation message

### 4. Onboarding (`/onboarding`)
Update to match SRS 2.2 + 3.x:
- Agency path: Create agency profile → Add first client → Create first project → Connect social accounts → Invite team
- Client path: Brand setup → Connect social accounts → Invite team → Set publishing schedule
- First-time login detection

### 5. Client Settings Page
Update to match SRS 2.4:
- Profile tab: Name, Email (with verification), Phone, Timezone, Password change
- Billing tab: Current plan, payment method, invoices
- Security tab: 2FA setup (email/phone), delete account
- Notifications tab: Configurable events (profile updates, new user, social profile connected, post created, approval requested/accepted/rejected)
- Team tab: Already exists
- Add: Saved Replies management, Tags management, Hashtag Suite management

### 6. Verify all navigation flows work end-to-end
- Login → Dashboard (returning user)
- Login → Onboarding (first-time)
- Register → Email verification → Login
- Forgot Password → Reset → Login
- Super Admin / Agency / Client dashboards all accessible
