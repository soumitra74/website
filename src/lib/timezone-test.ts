import { convertToIST, getTimezoneInfo } from './utils'

// Test timezone conversion
export function testTimezoneConversion() {
  console.log('Testing timezone conversion...')
  
  // Test with different times
  const testTimes = [
    new Date('2025-01-15T08:00:00'), // Morning
    new Date('2025-01-15T12:00:00'), // Noon
    new Date('2025-01-15T18:00:00'), // Evening
    new Date('2025-01-15T23:00:00'), // Night
  ]
  
  testTimes.forEach((time, index) => {
    const istTime = convertToIST(time)
    const tzInfo = getTimezoneInfo(time)
    
    console.log(`Test ${index + 1}:`)
    console.log(`  Local time: ${time.toLocaleTimeString()}`)
    console.log(`  IST time: ${istTime.toLocaleTimeString()}`)
    console.log(`  Timezone info:`, tzInfo)
    console.log('---')
  })
}

// Test specific timezone scenarios
export function testSpecificScenarios() {
  console.log('Testing specific scenarios...')
  
  // Test EST to IST using toLocaleString
  const estTime = new Date('2025-01-15T08:00:00-05:00') // 8 AM EST
  const istTime = convertToIST(estTime)
  console.log(`EST 8:00 AM → IST ${istTime.toLocaleTimeString()}`)
  
  // Test PST to IST using toLocaleString
  const pstTime = new Date('2025-01-15T08:00:00-08:00') // 8 AM PST
  const istTime2 = convertToIST(pstTime)
  console.log(`PST 8:00 AM → IST ${istTime2.toLocaleTimeString()}`)
  
  // Test UTC to IST using toLocaleString
  const utcTime = new Date('2025-01-15T08:00:00Z') // 8 AM UTC
  const istTime3 = convertToIST(utcTime)
  console.log(`UTC 8:00 AM → IST ${istTime3.toLocaleTimeString()}`)
  
  // Test direct toLocaleString approach
  console.log('\nDirect toLocaleString tests:')
  console.log(`EST 8:00 AM → IST ${estTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}`)
  console.log(`PST 8:00 AM → IST ${pstTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}`)
  console.log(`UTC 8:00 AM → IST ${utcTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}`)
}
