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
 *  ABPlugin.h
 *  ABPlugin
 *
 *  Created by delphine on 7-02-2006.
 */

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import <AddressBook/AddressBook.h>
#import "PasswordManager.h"

/*!
 @class ABPlugin
 @abstract Widget Plugin bridged with the AddressBook.
 */
@interface ABPlugin : NSObject {

	PasswordManager *passwordManager;
	NSMutableArray *contacts;
}

/**
 *	Methods in protocols WebScripting
 */
- (id)initWithWebView:(WebView*)webView;
- (void)windowScriptObjectAvailable:(WebScriptObject*)wso;

+ (NSString *)webScriptNameForSelector:(SEL)aSel;
+ (BOOL)isSelectorExcludedFromWebScript:(SEL)aSel;
+ (BOOL)isKeyExcludedFromWebScript:(const char*)key;

/*!
 @method setContacts:
 @abstract Sets the current mobile contacts in the AddressBook.
 @param contacts The contacts.
 */
- (void)setContacts:(NSArray *)contacts;

/*!
 @method contacts
 @abstract Returns the current mobile contacts in the AddressBook.
 @result The current contacts.
 */
- (NSArray *)contacts;

/*!
 @method loadContacts
 @abstract Loads mobile contacts from the AddressBook.
 */
- (void)loadContacts;

/*!
 @method contactForIndex:
 @abstract Returns the contact at the given position.
 @param index The contact's position.
 @result The contact's name.
 */
- (NSString *)contactForIndex:(int)index;

/*!
 @method numberForIndex:
 @abstract Returns the contact's number at the given position.
 @param index The contact's position.
 @result The contact's number.
 */
- (NSString *)numberForIndex:(int)index;

/*!
 @method count
 @abstract Returns the current number of mobile contacts in the AddressBook.
 @result The current number of contacts.
 */
- (int)count;

/*!
 @method saveContact:number:
 @abstract Saves a contact in the AddressBook.
 @param name The contact's full name.
 @param number The contact's number.
 */
- (void)saveContact:(NSString *)name number:(NSString *)number;

/*!
 @method ownNumber
 @abstract Returns the user's main number.
 @discussion This method finds the record associated to the current user in the AddressBook
 and returns the main phone number.
 @result The users's phone number.
 */
- (NSString *)ownNumber;

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

/*!
 @method systemVersionString
 @abstract Returns the system version (e.g. 10.4.11).
 @result The system version.
 */
- (NSString *)systemVersionString;

@end
