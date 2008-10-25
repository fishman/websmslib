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
 *  ContactTestCase.h
 *  ABPlugin
 *
 *  Created by delphine on 2-02-2008.
 *  Copyright 2008 Claudio Procida - Emeraldion Lodge. All rights reserved.
 */

#import <SenTestingKit/SenTestingKit.h>
#import "Contact.h"

@interface ContactTestCase : SenTestCase {
	Contact *contact;
}

- (void)testCreation;
- (void)testNumber;
- (void)testName;

@end
