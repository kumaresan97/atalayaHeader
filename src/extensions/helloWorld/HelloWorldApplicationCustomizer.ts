import { Log } from "@microsoft/sp-core-library";
import { BaseApplicationCustomizer } from "@microsoft/sp-application-base";
import { Dialog } from "@microsoft/sp-dialog";
import { sp } from "@pnp/sp/presets/all";

import * as strings from "HelloWorldApplicationCustomizerStrings";

const LOG_SOURCE: string = "HelloWorldApplicationCustomizer";
import "./Style/Style.css";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloWorldApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}
/** A Custom Action which can be run during execution of a Client Side Application */
export default class HelloWorldApplicationCustomizer extends BaseApplicationCustomizer<IHelloWorldApplicationCustomizerProperties> {
  public onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context,
    });
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    let message: string = this.properties.testMessage;
    if (!message) {
      message = "(No properties were provided.)";
    }
    let isCurrUserAsAdmin = false;

    // Getting the group value and checking logged user Admin or Not
    try {
      sp.web.siteGroups
        .getByName("Atalaya Admin")
        .users.get()
        .then((members: any) => {
          console.log(members[0].Id, "member");
          sp.web.currentUser.get().then((user) => {
            const currentUserId = user.Id;
            console.log(currentUserId, "id");
            // Checking current user as Admin
            isCurrUserAsAdmin = members.some(
              (member) => member.Id === currentUserId
            );
            console.log(isCurrUserAsAdmin, "membertrue");
            // const siteHeader = document.querySelector(
            //   ".sp-pageLayout-horizontalNav"
            // );||
            // if(siteHeader){

            // }
            // ...
            const siteHeader = document.querySelector(
              ".sp-pageLayout-horizontalNav"
            );
            const siteContent = document.querySelector(".sp-App-bodyContainer");

            console.log(siteHeader, "siteHeader");
            console.log(siteContent, "siteContent");

            if (siteHeader) {
              if (!isCurrUserAsAdmin) {
                siteHeader.setAttribute("data-custom-class", "nonAdmin");
              } else {
                siteHeader.removeAttribute("data-custom-class");
              }
            }

            if (siteContent) {
              if (!isCurrUserAsAdmin) {
                siteContent.setAttribute("data-custom-class", "nonAdmin");
              } else {
                siteContent.removeAttribute("data-custom-class");
              }
            }
          });
        })
        .catch((error) => {
          console.log("user dont have permission to group");

          console.error("Error retrieving site group members:", error);
          // const siteHeader = document.querySelector(
          //   ".sp-pageLayout-horizontalNav"
          // );

          // !isCurrUserAsAdmin
          //   ? siteHeader.setAttribute("data-custom-class", "nonAdmin")
          //   : "";

          const siteHeader = document.querySelector(
            ".sp-pageLayout-horizontalNav"
          );
          const siteContent = document.querySelector(".sp-App-bodyContainer");

          console.log(siteHeader, "siteHeader");
          console.log(siteContent, "siteContent");

          if (siteHeader) {
            if (!isCurrUserAsAdmin) {
              siteHeader.setAttribute("data-custom-class", "nonAdmin");
            } else {
              siteHeader.removeAttribute("data-custom-class");
            }
          }

          if (siteContent) {
            if (!isCurrUserAsAdmin) {
              siteContent.setAttribute("data-custom-class", "nonAdmin");
            } else {
              siteContent.removeAttribute("data-custom-class");
            }
          }
        });
    } catch (error) {}

    return Promise.resolve();
  }
}
