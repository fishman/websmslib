/**
 *	WebSMS widget
 *
 *	© Claudio Procida 2006-2008
 *
 *	Disclaimer
 *
 *	The WebSMS Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not its author(s), assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 *
 *	PasswordManagerTestCase.m
 *	ABPlugin
 *
 *	Created by delphine on 5-04-2008.
 *	Copyright 2008 Claudio Procida - Emeraldion Lodge. All rights reserved.
 */

#import "PasswordManagerTestCase.h"

static NSString *FixturePassword = @"bogus";
static NSString *FixtureService = @"WebSMSTest";
static NSString *FixtureAccountName = @"claudio";
static NSString *FixtureAccountNameAlternate = @"michele";

@implementation PasswordManagerTestCase

- (void)setUp
{
	pManager = [[PasswordManager alloc] init];
}

- (void)testSavePassword
{
	[pManager setPassword:FixturePassword
			   forService:FixtureService
			  accountName:FixtureAccountName];
}

- (void)testReadPassword
{
	[pManager setPassword:FixturePassword
			   forService:FixtureService
			  accountName:FixtureAccountName];
	
	NSString *pass = [pManager passwordForService:FixtureService
									  accountName:FixtureAccountName];
	
	STAssertEqualObjects(pass, FixturePassword, @"Wrong password");
}

- (void)testChangeAccountName
{
	[pManager setPassword:FixturePassword
			   forService:FixtureService
			  accountName:FixtureAccountName];

	NSString *pass = [pManager passwordForService:FixtureService
									  accountName:FixtureAccountName];

	STAssertEqualObjects(pass, FixturePassword, @"Wrong password");

	[pManager setPassword:FixturePassword
			   forService:FixtureService
			  accountName:FixtureAccountNameAlternate];
	
	pass = [pManager passwordForService:FixtureService
							accountName:FixtureAccountNameAlternate];
	
	STAssertEqualObjects(pass, FixturePassword, @"Wrong password");
}

- (void)testSavePasswordWithNilValues
{
	STAssertNoThrow([pManager setPassword:nil
							   forService:FixtureService
							  accountName:FixtureAccountName],
					@"Setting nil password threw exception");

	STAssertNoThrow([pManager setPassword:FixturePassword
							   forService:nil
							  accountName:FixtureAccountName],
					@"Setting nil service threw exception");

	STAssertNoThrow([pManager setPassword:FixturePassword
							   forService:FixtureService
							  accountName:nil],
					@"Setting nil account name threw exception");
	
	STAssertNoThrow([pManager setPassword:FixturePassword
							   forService:nil
							  accountName:nil],
					@"Setting nil service and account name threw exception");
	
	STAssertNoThrow([pManager setPassword:nil
							   forService:FixtureService
							  accountName:nil],
					@"Setting nil password and account name threw exception");
	
	STAssertNoThrow([pManager setPassword:nil
							   forService:nil
							  accountName:FixtureAccountName],
					@"Setting nil password and service threw exception");
	
	STAssertNoThrow([pManager setPassword:nil
							   forService:nil
							  accountName:nil],
					@"Setting nil all values threw exception");
}

- (void)testReadPasswordWithNilValues
{
	STAssertNoThrow([pManager passwordForService:FixtureService
									 accountName:nil],
					@"Using nil account name threw exception");
	
	STAssertNoThrow([pManager passwordForService:nil
									 accountName:FixtureAccountName],
					@"Setting nil service threw exception");
	
	STAssertNoThrow([pManager passwordForService:nil
									 accountName:nil],
					@"Setting nil all values threw exception");
}

- (void)tearDown
{
	[pManager release];
}

@end
