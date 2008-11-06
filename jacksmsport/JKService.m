//
//  JKService.m
//  jacksms
//
//  Created by malcom on 05/11/08.
//  Copyright 2008 __MyCompanyName__. All rights reserved.
//

#import "JKService.h"

@implementation JKService

- (id) initWithServiceAtURL:(NSString *) xmlURLPath {
	self = [super init];
	if (self != nil) {
		NSError *theError = NULL;

		xmlDocument = [[CXMLDocument alloc] initWithContentsOfURL: xmlURLPath
														  options: 0 error: &theError];
		if (theError != nil)
			NSLog(@"%@",[theError description]);
		
	}
	return self;
}


@end
