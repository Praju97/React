import React from "react";
import styled from "styled-components";
import "./locktooltip.scss";
const EditButton = styled.button``;


interface OptionsProps {
  propsSentFrom: string,
  userPermission: any,
  renamePathCallback: any,
  duplicatePathCallback: any,
  deletePathCallback: any,
  addToProjectFlow: any,
  setAliasCallback: any,
  flatView: any,
  type: any,
  WorkstatusFlow: any,
  createLinkForm: any,
  setUserDesignerEdit?: () => void,
  setUserDesignerView?: () => void,
  onInspectBtnClick?: any,
  isMetaData: boolean,
  activityType: any,
  pathCustomSetting: any,
  isLock: any,
  lockPath: any,
  singleElement: any,
  lockUnlockSinglePathFlagger: any;
}

export default function Options({
  propsSentFrom,
  userPermission,
  renamePathCallback,
  duplicatePathCallback,
  deletePathCallback,
  addToProjectFlow,
  setAliasCallback,
  flatView,
  type,
  WorkstatusFlow,
  createLinkForm,
  setUserDesignerEdit,
  setUserDesignerView,
  onInspectBtnClick,
  isMetaData,
  // activityType,
  pathCustomSetting,
  isLock,
  lockPath,
  lockUnlockSinglePathFlagger
}: OptionsProps) {
  const READ_ONLY = "Read Only"
  const MASTERY_CHECK = 'Mastery Check'
  const EDIT = "Edit";
  let optionValues = [
    { fn: renamePathCallback, title: "Rename" },
    { fn: duplicatePathCallback, title: "Duplicate", condition: ["permission", "noLockCheck"] },
    { fn: deletePathCallback, title: "Delete" },
    { fn: addToProjectFlow, title: "Add to project", condition: ["permission", "noLockCheck"] },
    { fn: setAliasCallback, title: "Version History", condition: ["permission", "noLockCheck"] },
    { fn: WorkstatusFlow, title: "Publishing Status", condition: ["permission", "noLockCheck"] },
    { fn: createLinkForm, title: "Create Link", condition: ["noCheck"] },
    { fn: flatView, title: "Flat View", condition: ["type"] },
    // { fn: lockPath, title: `${isLock ? "unlock" : "lock"}`, condition: ["permission", "lockbtn"] },
  ];
  // let activityTypeCheck = activityType && (activityType === "Lesson" || activityType === "Lesson: Static" || activityType === "Course" || activityType === "Unit" || activityType === "IR Units" || activityType === "IR Unit") ? true : false; 
  let activityTypeCheck = pathCustomSetting;
  if (isMetaData === true && activityTypeCheck === true) {
    optionValues.push({ fn: onInspectBtnClick, title: 'Inspect', condition: ["noCheck"] })
  }
  if (isMetaData === true) {
    optionValues.push({ fn: setUserDesignerEdit, title: 'Edit' })
  }
  if (isMetaData === true) {
    optionValues.push({ fn: setUserDesignerView, title: 'ViewOnly', condition: ["noCheck"] })
  }
  if (lockUnlockSinglePathFlagger) {
    optionValues.push({ fn: lockPath, title: `${isLock ? "Unlock" : "Lock"}`, condition: ["permission", "lockbtn"] })

  }
  const editButtonRenderer = (
    callBack: any,
    title: string,
    index: number,
    condition: any = ["permission"]
  ) => {
    const editBtn = (
      <EditButton className="dropdown-item" onClick={callBack} key={index} test-id="editBtn">
        {title}
      </EditButton>
    );

    if (condition.includes("permission")) {
      if (userPermission.contentManagement !== READ_ONLY) {
        if (isLock) {
          if (condition.includes("noLockCheck")) { // to show add to project , publish 
            return editBtn
          }
          if (condition.includes("lockbtn") && // to show lock btn for admin users for locked 
            ![EDIT].includes(userPermission.contentManagement)
          ) {
            return editBtn
          }
        }
        // else if (condition.includes("lockbtn")) { // to avoid showing lock btn for edit users unlocked 
        //   return ![EDIT].includes(userPermission.contentManagement) ? editBtn : ""
        // } 
        else {
          return editBtn // to show the remaining options with respect to the permission
        }
      }
    }

    if (condition.includes("type")) {
      return type === MASTERY_CHECK ? editBtn : "";
    }

    if (condition.includes("noCheck")) {
      return editBtn;
    }

    return "";
  };

  return (
    <div
      // className={`rename-button btn-group dropleft ml-1 ${isLock && "fixlockiconspacing"}`} 
      className="rename-button btn-group dropleft ml-1"
    >
      {isLock && propsSentFrom === "metadata" && (
        <div className="cosmos-lock-tooltip">
          <i className="fa fa-lock fa-lg cosmos-icon-theme" aria-hidden="true"></i>
          <span className="tooltiptext">This Item is locked</span>
        </div>
      )}
      <EditButton
        className="btn btn-secondary dropdown-toggle"
        id="dropdownMenuOffset"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span className="material-icons mt-0">more_vert</span>
      </EditButton>

      <div className="dropdown-menu" test-id="editBtnDiv" aria-labelledby="dropdownMenuOffset">
        {optionValues.map((x, i) => {
          return editButtonRenderer(x.fn, x.title, i, x.condition);
        })}
      </div>
    </div>
  );
}