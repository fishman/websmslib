//
//  jacksmsAppDelegate.m
//  jacksms
//
//  Created by malcom on 05/11/08.
//  Copyright __MyCompanyName__ 2008. All rights reserved.
//

#import "jacksmsAppDelegate.h"
#import "RootViewController.h"
#import "JKCore.h"

@implementation jacksmsAppDelegate

@synthesize window;
@synthesize navigationController;


- (void)applicationDidFinishLaunching:(UIApplication *)application {
	
	// Configure and show the window
	[window addSubview:[navigationController view]];
	[window makeKeyAndVisible];
	
	JKService *s = [[JKService alloc] initWithServiceAtURL: 
					[NSURL URLWithString: @"file:///Users/malcom/Desktop/untitled.xml"]];
	
	}


- (void)applicationWillTerminate:(UIApplication *)application {
	// Save data if appropriate
}


- (void)dealloc {
	[navigationController release];
	[window release];
	[super dealloc];
}

@end
