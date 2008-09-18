//
//  TestRunner.m
//  ABPlugin
//
//  Created by delphine on 2-02-2008.
//  Copyright 2008 Claudio Procida - Emeraldion Lodge. All rights reserved.
//

#import "TestRunner.h"


@implementation TestRunner

- (void)awakeFromNib
{
	NSLog(@"%@", [[NSBundle mainBundle] bundlePath]);
	
	[[NSBundle bundleWithPath:[[NSBundle mainBundle] pathForResource:@"ABPlugin"
															  ofType:@"widgetplugin"]] load];
	
	NSLog(@"%@", NSClassFromString(@"Contact"));
	
	id plugin = [[NSClassFromString(@"ABPlugin") alloc] initWithWebView:nil];
	[plugin windowScriptObjectAvailable:nil];
	[plugin loadContacts];
/*
	NSLog(@"%@", [plugin contacts]);
	NSLog(@"%@", [plugin ownNumber]);
	NSLog(@"%d", [plugin count]);
	NSLog(@"%@", [plugin systemVersionString]);

	[plugin saveContact:@"Artemio"
				 number:@"+390310027"];
	[plugin saveContact:@"Artemio Alipari"
				 number:@"+390310028"];
	[plugin saveContact:@"Artemio P. Alipari"
				 number:@"+390310029"];
	[plugin saveContact:@"Artemio Pasquale JR Alipari"
				 number:@"+390310031"];
*/
}

@end
