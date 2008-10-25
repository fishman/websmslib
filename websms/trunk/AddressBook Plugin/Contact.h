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
 *  Contact.h
 *  ABPlugin
 *
 *  Created by delphine on 7-02-2006.
 */

#import <Cocoa/Cocoa.h>

/*!
 @class Contact
 @abstract A contact from the AddressBook.
 */

@interface Contact : NSObject {
	NSString *name;
	NSString *number;
}

/*!
 @method initWithName:number:
 @abstract Returns a contact object initialized with the given <tt>name</tt> and <tt>number</tt>.
 @param name The contact's name.
 @param number The contact's number.
 */
- (id)initWithName:(NSString *)name number:(NSString *)number;

/*!
 @method contact
 @abstract Returns a contact object.
 */
+ (Contact *)contact;

/*!
 @method contactWithName:number:
 @abstract Returns a contact object initialized with the given <tt>name</tt> and <tt>number</tt>.
 @param name The contact's name.
 @param number The contact's number.
 */
+ (Contact *)contactWithName:(NSString *)name number:(NSString *)number;

/*!
 @method setName:
 @abstract Sets the contact's name.
 @param name The contact's name.
 */
- (void)setName:(NSString *)name;

/*!
 @method name
 @abstract Returns the contact's name.
 @result The contact's name.
 */
- (NSString *)name;

/*!
 @method setNumber:
 @abstract Sets the contact's number.
 @param number The contact's number.
 */
- (void)setNumber:(NSString *)number;

/*!
 @method number
 @abstract Returns the contact's number.
 @result The contact's number.
 */
- (NSString *)number;

/*!
 @method caseInsensitiveCompare:
 @abstract Compares two contacts.
 @discussion This method returns <tt>NSOrderAscending</tt> if 
 @param other The contact to compare the receiver to.
 @result <tt>NSOrderedAscending</tt> when the receiver precedes <tt>other</tt> in lexical ordering,
 <tt>NSOrderedSame</tt> if the receiver and <tt>other</tt> are equivalent in lexical value, and
 <tt>NSOrderedDescending</tt> if the receiver follows <tt>other</tt>.
 */
- (NSComparisonResult)caseInsensitiveCompare:(Contact *)other;

@end
