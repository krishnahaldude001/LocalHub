import { createPrismaClient } from '../src/lib/db-connection'
import { hasPermission, type UserRole } from '../src/lib/roles'

// Test user credentials for each role
const TEST_USERS = {
  admin: {
    email: 'admin@localhub.com',
    password: 'admin123',
    role: 'admin' as UserRole
  },
  editor: {
    email: 'editor@localhub.com', 
    password: 'editor123',
    role: 'editor' as UserRole
  },
  dealer: {
    email: 'dealer@localhub.com',
    password: 'dealer123', 
    role: 'dealer' as UserRole
  },
  news_writer: {
    email: 'news@localhub.com',
    password: 'news123',
    role: 'news_writer' as UserRole
  },
  user: {
    email: 'user@localhub.com',
    password: 'user123',
    role: 'user' as UserRole
  }
}

// Define all permissions to test
const ALL_PERMISSIONS = [
  // User Management
  'canReadUsers', 'canCreateUsers', 'canEditUsers', 'canDeleteUsers',
  // Deal Management  
  'canReadDeals', 'canCreateDeals', 'canEditDeals', 'canDeleteDeals',
  // News Management
  'canReadNews', 'canCreateNews', 'canEditNews', 'canDeleteNews', 
  // Shop Management
  'canReadShops', 'canCreateShops', 'canEditShops', 'canDeleteShops',
  // System Settings
  'canManageSettings', 'canViewAnalytics', 'canManagePlatforms'
] as const

// Expected permissions for each role
const EXPECTED_PERMISSIONS = {
  admin: {
    canReadUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canReadDeals: true,
    canCreateDeals: true,
    canEditDeals: true,
    canDeleteDeals: true,
    canReadNews: true,
    canCreateNews: true,
    canEditNews: true,
    canDeleteNews: true,
    canReadShops: true,
    canCreateShops: true,
    canEditShops: true,
    canDeleteShops: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canManagePlatforms: true,
  },
  editor: {
    canReadUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canReadDeals: true,
    canCreateDeals: true,
    canEditDeals: true,
    canDeleteDeals: false,
    canReadNews: true,
    canCreateNews: true,
    canEditNews: true,
    canDeleteNews: false,
    canReadShops: true,
    canCreateShops: false,
    canEditShops: false,
    canDeleteShops: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canManagePlatforms: false,
  },
  dealer: {
    canReadUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canReadDeals: true,
    canCreateDeals: true,
    canEditDeals: true,
    canDeleteDeals: true,
    canReadNews: false,
    canCreateNews: false,
    canEditNews: false,
    canDeleteNews: false,
    canReadShops: true,
    canCreateShops: true,
    canEditShops: true,
    canDeleteShops: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canManagePlatforms: false,
  },
  news_writer: {
    canReadUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canReadDeals: false,
    canCreateDeals: false,
    canEditDeals: false,
    canDeleteDeals: false,
    canReadNews: true,
    canCreateNews: true,
    canEditNews: true,
    canDeleteNews: false,
    canReadShops: false,
    canCreateShops: false,
    canEditShops: false,
    canDeleteShops: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canManagePlatforms: false,
  },
  user: {
    canReadUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canReadDeals: true,
    canCreateDeals: false,
    canEditDeals: false,
    canDeleteDeals: false,
    canReadNews: true,
    canCreateNews: false,
    canEditNews: false,
    canDeleteNews: false,
    canReadShops: true,
    canCreateShops: false,
    canEditShops: false,
    canDeleteShops: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canManagePlatforms: false,
  }
}

interface TestResult {
  role: string
  passed: boolean
  totalTests: number
  passedTests: number
  failedTests: string[]
  details: Record<string, { expected: boolean; actual: boolean; passed: boolean }>
}

async function testUserPermissions(): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  console.log('🧪 Starting User Permission Tests...\n')
  
  for (const [roleName, user] of Object.entries(TEST_USERS)) {
    console.log(`\n🔍 Testing ${roleName.toUpperCase()} role (${user.email})...`)
    
    const result: TestResult = {
      role: roleName,
      passed: true,
      totalTests: 0,
      passedTests: 0,
      failedTests: [],
      details: {}
    }
    
    const expectedPermissions = EXPECTED_PERMISSIONS[roleName as keyof typeof EXPECTED_PERMISSIONS]
    
    for (const permission of ALL_PERMISSIONS) {
      result.totalTests++
      
      const expected = expectedPermissions[permission as keyof typeof expectedPermissions]
      const actual = hasPermission(user.role, permission)
      const passed = expected === actual
      
      result.details[permission] = { expected, actual, passed }
      
      if (passed) {
        result.passedTests++
        console.log(`  ✅ ${permission}: ${actual ? 'ALLOWED' : 'DENIED'}`)
      } else {
        result.failedTests.push(permission)
        result.passed = false
        console.log(`  ❌ ${permission}: Expected ${expected}, got ${actual}`)
      }
    }
    
    results.push(result)
    
    // Summary for this role
    const percentage = Math.round((result.passedTests / result.totalTests) * 100)
    console.log(`\n📊 ${roleName.toUpperCase()} Summary: ${result.passedTests}/${result.totalTests} (${percentage}%)`)
    
    if (result.passed) {
      console.log(`✅ ${roleName.toUpperCase()} role permissions are CORRECT`)
    } else {
      console.log(`❌ ${roleName.toUpperCase()} role permissions have ISSUES`)
    }
  }
  
  return results
}

async function testDatabaseUsers() {
  console.log('\n🔍 Checking database users...')
  
  const prisma = createPrismaClient()
  
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        name: true
      }
    })
    
    console.log(`\n📋 Found ${users.length} users in database:`)
    
    for (const user of users) {
      const testUser = Object.values(TEST_USERS).find(u => u.email === user.email)
      if (testUser) {
        console.log(`  ✅ ${user.name || 'No name'} (${user.email}) - Role: ${user.role} - MATCHES TEST DATA`)
      } else {
        console.log(`  ⚠️  ${user.name || 'No name'} (${user.email}) - Role: ${user.role} - NOT IN TEST DATA`)
      }
    }
    
    // Check if all test users exist
    const missingUsers = Object.values(TEST_USERS).filter(testUser => 
      !users.find(dbUser => dbUser.email === testUser.email)
    )
    
    if (missingUsers.length > 0) {
      console.log(`\n⚠️  Missing test users in database:`)
      missingUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`)
      })
    } else {
      console.log(`\n✅ All test users exist in database`)
    }
    
  } catch (error) {
    console.error('❌ Error checking database users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function generateTestReport(results: TestResult[]) {
  console.log('\n' + '='.repeat(60))
  console.log('📊 COMPREHENSIVE TEST REPORT')
  console.log('='.repeat(60))
  
  const totalTests = results.reduce((sum, result) => sum + result.totalTests, 0)
  const totalPassed = results.reduce((sum, result) => sum + result.passedTests, 0)
  const totalFailed = totalTests - totalPassed
  const overallPercentage = Math.round((totalPassed / totalTests) * 100)
  
  console.log(`\n📈 Overall Results:`)
  console.log(`  Total Tests: ${totalTests}`)
  console.log(`  Passed: ${totalPassed}`)
  console.log(`  Failed: ${totalFailed}`)
  console.log(`  Success Rate: ${overallPercentage}%`)
  
  console.log(`\n📋 Role-by-Role Results:`)
  results.forEach(result => {
    const percentage = Math.round((result.passedTests / result.totalTests) * 100)
    const status = result.passed ? '✅ PASS' : '❌ FAIL'
    console.log(`  ${result.role.toUpperCase()}: ${result.passedTests}/${result.totalTests} (${percentage}%) ${status}`)
    
    if (!result.passed) {
      console.log(`    Failed permissions: ${result.failedTests.join(', ')}`)
    }
  })
  
  // Detailed failure analysis
  const failedRoles = results.filter(r => !r.passed)
  if (failedRoles.length > 0) {
    console.log(`\n🔍 Detailed Failure Analysis:`)
    failedRoles.forEach(result => {
      console.log(`\n  ${result.role.toUpperCase()} failures:`)
      Object.entries(result.details)
        .filter(([_, detail]) => !detail.passed)
        .forEach(([permission, detail]) => {
          console.log(`    ${permission}: Expected ${detail.expected}, got ${detail.actual}`)
        })
    })
  }
  
  console.log(`\n${overallPercentage >= 90 ? '🎉' : '⚠️'} Test ${overallPercentage >= 90 ? 'PASSED' : 'FAILED'} - ${overallPercentage}% success rate`)
  
  if (overallPercentage < 90) {
    console.log('\n💡 Recommendations:')
    console.log('  1. Check role permission definitions in src/lib/roles.ts')
    console.log('  2. Verify user roles in database')
    console.log('  3. Ensure permission checking logic is correct')
  }
}

async function main() {
  try {
    console.log('🚀 Starting Comprehensive User Permission Testing...\n')
    
    // Test database users first
    await testDatabaseUsers()
    
    // Run permission tests
    const results = await testUserPermissions()
    
    // Generate comprehensive report
    await generateTestReport(results)
    
    console.log('\n✨ Testing completed!')
    
  } catch (error) {
    console.error('❌ Test execution failed:', error)
    process.exit(1)
  }
}

// Run the tests
main()
