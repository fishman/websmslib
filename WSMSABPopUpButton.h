//
//  WSMSABPopUpButton.h
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "DKPopUpButton.h"
#import <AddressBook/AddressBook.h>

@protocol WSMSABPopUpButton_Protocol
- (void) wsms_abpop_selectedPeopleData:(NSDictionary *) _data;
- (void) wsms_abpop_otherNumberMenu;
@end

@interface WSMSABPopUpButton : DKPopUpButton {
	NSMenu *_menu;
	NSObject <WSMSABPopUpButton_Protocol> *_delegate;
}

- (void) reloadAddressBook;
- (void) setDelegate:(NSObject <WSMSABPopUpButton_Protocol> *) _del;


- (NSMenu *) _getAddressBook;
- (NSMenu *) _getRecentlyUsedMenu;

@end
