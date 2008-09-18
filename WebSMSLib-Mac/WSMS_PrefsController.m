//
//  WSMS_PrefsController.m
//  websmslib
//
//  Created by malcom on 9/4/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WSMS_PrefsController.h"


@implementation WSMS_PrefsController


- (void)setupToolbar
{
	[self addView:pane_accounts label:@"Accounts" image: [NSImage imageNamed: @"info"]];
	[self addView:pane_plugins label:@"Plugins" image: [NSImage imageNamed: @"KEXT"]];
	[self addView:pane_settings label:@"Options" image: [NSImage imageNamed: @"Autoexec"]];

		// Optional configuration settings.
	[self setCrossFade: YES];
	[self setShiftSlowsAnimation: YES];
}

- (void) loadPreferencesData {
	
}

@end
