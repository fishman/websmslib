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
 *	PasswordManager.h
 *	ABPlugin
 *
 *	Created by delphine on 5-04-2008.
 *	Copyright 2008 Claudio Procida - Emeraldion Lodge. All rights reserved.
 */

#import <Cocoa/Cocoa.h>
#import <Security/Security.h>

static const NSString *PMServiceNameFormat = @"WebSMS Password for %@ (%@)";

/*!
 @class PasswordManager
 @abstract Password manager for accounts stored in the Keychain.
 @discussion PasswordManager objects are responsible for storing, retrieving and updating
 passwords from the user's Keychain for the account(s) used with WebSMS.
 */
@interface PasswordManager : NSObject {

	NSDictionary *kcItemRefs;
}

/*!
 @method setPassword:forService:accountName:
 @abstract Sets the password for account <tt>acct</tt> of service <tt>srv</tt>.
 @param pass The password for the account.
 @param srv The name of the service.
 @param acct The name of the account.
 */
- (void)setPassword:(NSString *)pass forService:(NSString *)srv accountName:(NSString *)acct;

/*!
 @method passwordForAccount:
 @abstract Returns the password for account <tt>acct</tt> of service <tt>srv</tt>.
 @param srv The name of the service.
 @param acct The name of the account.
 @result The password for the desired account.
 */
- (NSString *)passwordForService:(NSString *)srv accountName:(NSString *)acct;

@end
