//
//  WSMS_PrefsController.h
//  websmslib
//
//  Created by malcom on 9/4/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "DBPrefsWindowController.h"

@interface WSMS_PrefsController : DBPrefsWindowController {
	IBOutlet NSView *pane_accounts;
	IBOutlet NSView *pane_plugins;
	IBOutlet NSView *pane_settings;
}

@end
