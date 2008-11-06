//
//  JKService.h
//  jacksms
//
//  Created by malcom on 05/11/08.
//  Copyright 2008 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
// HOW TO USE TOUCHXML http://forums.macrumors.com/archive/index.php/t-527564.html
#import "TouchXML.h"

@interface JKService : NSObject {
	CXMLDocument	*xmlDocument;
}

- (id) initWithServiceAtURL:(NSString *) xmlURLPath;

@end
