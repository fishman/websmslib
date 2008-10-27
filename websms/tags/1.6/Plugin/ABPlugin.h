//
//  ABPlugin.h
//  ABPlugin
//
//  Created by delphine on 7-02-2006.
//  Copyright 2006 Emeraldion Lodge. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import <AddressBook/AddressBook.h>


@interface ABPlugin : NSObject {

	NSMutableArray *contacts;
	ABAddressBook *addressbook;
}

- (id) initWithWebView:(WebView*)webView;
- (void) windowScriptObjectAvailable:(WebScriptObject* )windowScriptObject;

- (void)windowScriptObjectAvailable:(WebScriptObject*)wso;

+ (NSString *)webScriptNameForSelector:(SEL)aSel;
+ (BOOL)isSelectorExcludedFromWebScript:(SEL)aSel;
+ (BOOL)isKeyExcludedFromWebScript:(const char*)key;

- (void)loadContacts;
- (int)count;
- (NSString *)contactForIndex:(int)index;
- (NSString *)numberForIndex:(int)index;

@end
