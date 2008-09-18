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
 *  ContactTestCase.m
 *  ABPlugin
 *
 *  Created by delphine on 2-02-2008.
 *  Copyright 2008 Claudio Procida - Emeraldion Lodge. All rights reserved.
 */

#import "ContactTestCase.h"


@implementation ContactTestCase

#pragma mark Test Harness

- (void)setUp
{
	contact = [[Contact alloc] init];
}

- (void)tearDown
{
	[contact release];
}

#pragma mark -
#pragma mark Test Cases

- (void)testCreation
{
	Contact *aContact = [[Contact alloc] init];
	STAssertNotNil(aContact);
	[aContact release];
}

- (void)testNilName
{
	[contact setName:nil];
	STAssertNotNil([contact name], @"Name should not be nil");
}

- (void)testNilNumber
{
	[contact setNumber:nil];
	STAssertNotNil([contact number], @"number should not be nil");
}

- (void)testNumber
{
	NSString *bogusNumber = @"3331234567";
	[contact setNumber:bogusNumber];
	STAssertEqualObjects([contact number], bogusNumber, @"number was not set correctly");
}

- (void)testName
{
	NSString *bogusName = @"Paranzio Malmenati";
	[contact setName:bogusName];
	STAssertEqualObjects([contact name], bogusName, @"name was not set correctly");
}

@end
