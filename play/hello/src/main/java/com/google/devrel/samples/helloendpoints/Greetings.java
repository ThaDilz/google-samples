package com.google.devrel.samples.helloendpoints;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.users.User;
import java.util.ArrayList;
import java.util.List;
import javax.inject.Named;

/**
 * Defines v1 of a helloworld API, which provides simple "greeting" methods.
 */
@Api(
        name = "helloworld",
        version = "v1",
        scopes = {Constants.EMAIL_SCOPE},
        clientIds = {Constants.WEB_CLIENT_ID},
        audiences = {}
)
public final class Greetings {

  public static List<HelloGreeting> greetings = new ArrayList<>();

  static {
    greetings.add(new HelloGreeting("hello world!"));
    greetings.add(new HelloGreeting("goodbye world!"));
  }

  public HelloGreeting getGreeting(@Named("id") Integer id) {
    return greetings.get(id);
  }

  public List<HelloGreeting> listGreeting() {
    return greetings;
  }

  @ApiMethod(
          name = "greetings.multiply", 
          httpMethod = "post"
  )
  public HelloGreeting insertGreeting(
          @Named("times") Integer times, 
          HelloGreeting greeting) {
    
    HelloGreeting response = new HelloGreeting();
    StringBuilder responseBuilder = new StringBuilder();
    
    for (int i = 0; i < times; i++) {
      responseBuilder.append(greeting.getMessage());
    }
    
    response.setMessage(responseBuilder.toString());
    return response;
  }

  @ApiMethod(
          name = "greetings.authed", 
          path = "hellogreeting/authed"
  )
  public HelloGreeting authedGreeting(User user) {
    HelloGreeting response = new HelloGreeting("hello " + user.getEmail());
    return response;
  }
}
