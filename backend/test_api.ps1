# Job Platform Backend API Test Script
# Run this in PowerShell to test all endpoints

$baseUrl = "http://localhost:8000/api/accounts"

Write-Host "🧪 Testing Job Platform Backend API" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# 1. Register a new user
Write-Host "`n1. Registering new user..." -ForegroundColor Yellow
$registerData = @{
    username = "testuser"
    email = "test@example.com"
    password = "testpass123"
    password_confirm = "testpass123"
    first_name = "Test"
    last_name = "User"
    is_minor = $false
    guardian_email = ""
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/register/" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ User registered successfully!" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Login
Write-Host "`n2. Logging in..." -ForegroundColor Yellow
$loginData = @{
    username = "testuser"
    password = "testpass123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login/" -Method POST -Body $loginData -ContentType "application/json"
    $accessToken = $loginResponse.access
    $refreshToken = $loginResponse.refresh
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 3. Get current user info
Write-Host "`n3. Getting current user info..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

try {
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/me/" -Method GET -Headers $headers
    Write-Host "✅ User info retrieved!" -ForegroundColor Green
    Write-Host "   Username: $($meResponse.username)" -ForegroundColor Cyan
    Write-Host "   Email: $($meResponse.email)" -ForegroundColor Cyan
    Write-Host "   Verification Status: $($meResponse.verification_status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get user info failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Submit verification
Write-Host "`n4. Submitting verification..." -ForegroundColor Yellow
$verificationData = @{
    meta = @{
        document_type = "driver_license"
        document_number = "DL123456789"
        submitted_at = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    }
} | ConvertTo-Json

try {
    $verificationResponse = Invoke-RestMethod -Uri "$baseUrl/verification/submit/" -Method POST -Body $verificationData -Headers $headers -ContentType "application/json"
    Write-Host "✅ Verification submitted!" -ForegroundColor Green
    Write-Host "   Status: $($verificationResponse.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Verification submission failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Get verification status
Write-Host "`n5. Getting verification status..." -ForegroundColor Yellow
try {
    $verificationStatusResponse = Invoke-RestMethod -Uri "$baseUrl/verification/me/" -Method GET -Headers $headers
    Write-Host "✅ Verification status retrieved!" -ForegroundColor Green
    Write-Host "   Status: $($verificationStatusResponse.status)" -ForegroundColor Cyan
    Write-Host "   Created: $($verificationStatusResponse.created_at)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get verification status failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Test with minor user
Write-Host "`n6. Testing minor user registration..." -ForegroundColor Yellow
$minorUserData = @{
    username = "minoruser"
    email = "minor@example.com"
    password = "testpass123"
    password_confirm = "testpass123"
    first_name = "Minor"
    last_name = "User"
    is_minor = $true
    guardian_email = "guardian@example.com"
} | ConvertTo-Json

try {
    $minorResponse = Invoke-RestMethod -Uri "$baseUrl/register/" -Method POST -Body $minorUserData -ContentType "application/json"
    Write-Host "✅ Minor user registered successfully!" -ForegroundColor Green
    Write-Host "   Is Minor: $($minorResponse.is_minor)" -ForegroundColor Cyan
    Write-Host "   Guardian Email: $($minorResponse.guardian_email)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Minor user registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "`n📋 Available Endpoints:" -ForegroundColor Yellow
Write-Host "   POST $baseUrl/register/ - Register new user" -ForegroundColor White
Write-Host "   POST $baseUrl/login/ - Login with JWT" -ForegroundColor White
Write-Host "   GET  $baseUrl/me/ - Get current user info" -ForegroundColor White
Write-Host "   POST $baseUrl/verification/submit/ - Submit verification" -ForegroundColor White
Write-Host "   GET  $baseUrl/verification/me/ - Get verification status" -ForegroundColor White
Write-Host "   POST $baseUrl/verification/approve/{user_id}/ - Approve verification (admin only)" -ForegroundColor White
Write-Host "   POST $baseUrl/token/refresh/ - Refresh JWT token" -ForegroundColor White

Write-Host "`n🔧 Admin Panel: http://localhost:8000/admin/" -ForegroundColor Cyan
Write-Host "   Username: admin" -ForegroundColor Cyan
Write-Host "   Password: (you set this during setup)" -ForegroundColor Cyan
