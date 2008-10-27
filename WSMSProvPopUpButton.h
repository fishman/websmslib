//
//  WSMSProvPopUpButton.h
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "DKPopUpButton.h"

@interface WSMSProvPopUpButton : DKPopUpButton {
	NSMenu *_menu;
}

- (void) reloadProvidersList;

@end
