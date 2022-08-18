// eslint-disable-next-line
import React from "react";
import { connect } from "react-redux";
import cosmosApiService from "../../service/cosmosApiService";
import { Link } from "react-router-dom";
import { AppState } from "../../store";
import JiraStatus from "./JiraStatus";
import styled from "styled-components";
import { ApolloClient } from "apollo-client";
// // eslint-disable-next-line
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import {
  createApolloMiddleware,
  createHttpLinkApollo,
} from "../../service/apolloClient";
import {changeAttributes, getLessionMeta } from "../../gqlQuery/gqlQuery";
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Options from "./widgets/options";
import { entityAttributes, lessonData } from "../../config/ifcConfig";
import CosModal from "../../components/cosmos/CosModal";
import MessageComponent from "../../components/common/MessageComponent";
import ViewOnlyBtn from "../../assets/img/svg/ViewOnlyBtn";
import InspectBtn from "../../assets/img/svg/InspectBtn";

const EditButton = styled.button``;
const ignoreMetadataLabel = ['ProductPathID']
// let lockunlockDefinitionId = (window as any).APP_ENV.LOCK_UNLOCK_DEFINITION_ID;
interface CosDataTableProps {
  databody?: any;
  numberOfItemPagination?: any;
  numberOfItemPaginationMeta?: any;
  nextPage?: any;
  prevPage?: any;
  nextMetaPage?: any;
  prevMetaPage?: any;
  sortableEvent?: any;
  sortOrder?: any;
  sortColumn?: any;
  currentPageNo?: any;
  currentMetaPageNo?: any;
  pathRefId?: any;
  pathRefName?: any;
  renamePathCallback?: any;
  duplicatePathCallback?: any;
  deletePathCallback?: any;
  dropDownValue?: any;
  metadataValue?: any;
  perPageCount?: any;
  perPageCountMeta?: any;
  metadataHeader?: any;
  metadataGrid?: any;
  setShowMetaPopup?: any;
  pageHistory: any;
  productId: any;
  setAliasCallback: any;
  flatView: any;
  mpngThemeValue?: any;
  launchLanguage?: any;
  sortMetaDataColumn?: any;
  sortMetaDataOrder?: any;
  userPermission?: any;
  isJiraIntegrationEnabled: boolean;
  isBulkUpdateEnabled: boolean;
  setShowJiraModal?: any;
  setBulkUpdateMetaModal?: any;
  setBulkUpdateAliasModal?: any;
  type?: any;
  clearSelected?: any;
  WorkstatusFlow?: any;
  bulkUpdateInMetadaView?: any;
  userSelectedColumn?: any;
  setParentRendering?: any;
  oktaUserId?: any;
  preDefinedColumnPersonalizationValues?: any;
  addToProjectFlow?: any;
  addToProjectFlagger?: any;
  createLinkForm?: any;
  lockunlockDefinitionId?: any;
  workFlowDefinitionId?: any;
  projectdefinitionId?: any; 
  doolittleBaseUrl?: any;
  userEmail?: any;
  pathDetails?: any;
  lockUnlockSinglePathFlagger?: any;
  setBulkUpdatePathAttributes?:any;
}

interface CosDataTableState {
  dataHeader?: any;
  dataBody?: any;
  currentPageNo?: any;
  currentMetaPageNo?: any;
  totalPages?: any;
  totalCount?: any;
  pageSize?: any;
  pageSizeMeta?: any;
  sortingColumn?: any;
  sortingOrder?: any;
  redirect?: any;
  metadataValue?: any;
  metadataHeader?: any;
  metadataGrid?: any;
  masterArray?: any;
  greaterThanFive?: any;
  totalWidth?: any;
  columnWidth?: any;
  pathVersionUrl?: any;
  pathVersionNumber?: any;
  sortingMetaDataColumn?: any;
  sortingMetaDataOrder?: any;
  pathRefsId?: any;
  selectedRows?: any;
  tableMetaRef?: any;
  columnSelectedState?: any;
  activeSaveColumnButton?: any;
  currentComponentReRender?: any;
  // showColumnSelectionDropdown?: any;
  appModuleID?: any;
  showModal: boolean;
  form: any;
}

class CosDataTableUnconnected extends React.Component<
  CosDataTableProps,
  CosDataTableState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      // dataHeader: [
      //   { name: "name", text: "Title", sort: true  },
      //   { name: "jiraStatus", text: "Ticket Status", sort: false, id: "dd322165-dd24-492e-8969-9169009fd509", active: true },
      //   { name: "status", text: "Status", sort: true, id: "480677d8-c56b-492c-b406-859ff3be1ca1", active: true  },
      //   { name: "production", text: "Alias", sort: false, id: "0692a7ae-4139-4947-a3e1-9d1b1f11a6f8", active: true },
      //   { name: "modifiedAt", text: "Updated At", sort: true, id: "b3f6b0f2-c92f-468a-97d6-99838404e755", active: true },
      //   { name: "modifiedBy", text: "Updated By", sort: true, id: "1f1792a7-a6e8-4ced-8244-f7ace7e1482e", active: true },
      //   // { name: "name", text: "Action" },
      // ],
      dataHeader: [],
      // columnSelectedState: [
      //   { name: "jiraStatus", text: "Ticket Status", id: "dd322165-dd24-492e-8969-9169009fd509", isChecked: true, active: true },
      //   { name: "status", text: "Status", id: "480677d8-c56b-492c-b406-859ff3be1ca1", isChecked: true, active: true  },
      //   { name: "production", text: "Alias", id: "0692a7ae-4139-4947-a3e1-9d1b1f11a6f8", isChecked: true, active: true },
      //   { name: "modifiedAt", text: "Updated At", id: "b3f6b0f2-c92f-468a-97d6-99838404e755", isChecked: true, active: true },
      //   { name: "modifiedBy", text: "Updated By", id: "1f1792a7-a6e8-4ced-8244-f7ace7e1482e", isChecked: true, active: true },
      // ],
      columnSelectedState: [],
      dataBody: {},
      currentPageNo: 0,
      currentMetaPageNo: 0,
      totalPages: 1,
      pageSize: props.perPageCount,
      pageSizeMeta: props.perPageCountMeta,
      sortingColumn: "name",
      sortingOrder: true,
      redirect: null,
      metadataHeader: [],
      metadataGrid: [],
      masterArray: [],
      metadataValue: this.props.metadataValue,
      greaterThanFive: false,
      totalWidth: 0,
      columnWidth: 0,
      pathVersionUrl: null,
      pathVersionNumber: null,
      sortingMetaDataColumn: props.sortMetaDataColumn,
      sortingMetaDataOrder: props.sortMetaDataOrder,
      totalCount: 0,
      pathRefsId: this.props.pathRefId,
      selectedRows: [],
      tableMetaRef: React.createRef(),
      activeSaveColumnButton: true,
      currentComponentReRender: true,
      // showColumnSelectionDropdown: false,
      appModuleID: "",
      showModal: false,
      form: {}
    };
    this.setUserMpng = this.setUserMpng.bind(this);
  }

  componentDidMount() {

    // let updatedDataHeader: any = [];   
    // let structuredObject: any = {}
    // let conditionCheck: any = Boolean;

    // updatedDataHeader.push({ name: "name", text: "Title", sort: true  })

    // this.props.preDefinedColumnPersonalizationValues && 
    // this.props.preDefinedColumnPersonalizationValues.forEach((element: any) => {
    //   if(element.name === "Content Management") {
    //     element.moduleSetting.map((data: any) => {
    //       if (data.name === "Status" || data.name === "Updated At" || data.name === "Updated By" ) {
    //         conditionCheck = true
    //       } else {
    //         conditionCheck = false
    //       }
    //       structuredObject = {
    //         name: data.name, 
    //         text: data.name, 
    //         sort: conditionCheck, 
    //         id: data.id, 
    //         active: true
    //       }
    //       updatedDataHeader.push(structuredObject);
    //     })
    //   }
    // })

    // this.setState({
    //   dataHeader: updatedDataHeader
    // })
    let selectedRowsCopy = this.state.selectedRows ? [...this.state.selectedRows] : [];

    if (this.props.databody.hasOwnProperty('results')) {
      this.props.databody.results.map((singlePath: any) => {
        let index = selectedRowsCopy.findIndex((item: any) => item.learningPath.pathId === singlePath.learningPath.pathId);
        if(index > -1) {
          singlePath["selected"] = true;
          selectedRowsCopy[index] = singlePath;
        }
        return singlePath;
      })
    }

    this.setState({
      selectedRows: selectedRowsCopy,
      dataBody: this.props.databody,
      sortingColumn: this.props.sortColumn,
      sortingOrder: this.props.sortOrder === "asc" ? true : false,
      sortingMetaDataColumn: this.props.sortMetaDataColumn,
      sortingMetaDataOrder:
        this.props.sortMetaDataOrder === "asc" ? true : false,
    });

  }

  componentWillReceiveProps(nextProps: CosDataTableProps) {

    let updatedDataHeader: any = [];
    let structuredObject: any = {}
    let conditionCheck: any = Boolean;

    updatedDataHeader.push({ name: "name", text: "Title", sort: true })

    nextProps.preDefinedColumnPersonalizationValues &&
      nextProps.preDefinedColumnPersonalizationValues.forEach((element: any) => {
        if (element.name === "Content Management") {
          this.setState({
            appModuleID: element.id
          })
          element.moduleSetting.forEach((data: any) => {
            if (data.name === "Status" || data.name === "Updated At" || data.name === "Updated By" || data.name === "Project") {
              conditionCheck = true
            } else {
              conditionCheck = false
            }
            structuredObject = {
              name: data.name,
              text: data.name,
              sort: conditionCheck,
              id: data.id,
              active: true
            }
            updatedDataHeader.push(structuredObject);
          })
        }
      })

    this.setState({
      dataHeader: updatedDataHeader
    })


    /** For column selected state */

    let updatedDataHeaderColumnSelected: any = [];
    let structuredObjectColumnSelected: any = {}

    nextProps.preDefinedColumnPersonalizationValues &&
      nextProps.preDefinedColumnPersonalizationValues.forEach((element: any) => {
        if (element.name === "Content Management") {
          element.moduleSetting.forEach((data: any) => {
            structuredObjectColumnSelected = {
              name: data.name,
              text: data.name,
              id: data.id,
              active: true,
              isChecked: true
            }
            updatedDataHeaderColumnSelected.push(structuredObjectColumnSelected);
          })
        }
      })

    updatedDataHeaderColumnSelected && updatedDataHeaderColumnSelected.forEach((element: any) => {
      let valuehasMatchedForColumn: any = false;
      if (nextProps.userSelectedColumn && nextProps.userSelectedColumn.length > 0) {
        nextProps.userSelectedColumn &&
          nextProps.userSelectedColumn.forEach((value: any) => {
            if (value.appModuleSettingID === element.id && value.active === element.active) {
              valuehasMatchedForColumn = true;
            }
          });

        if (valuehasMatchedForColumn) {
          element.isChecked = true;
        } else {
          element.isChecked = false;
        }
      } else {
        element.isChecked = true;
      }

    })

    this.setState({
      columnSelectedState: updatedDataHeaderColumnSelected
    })

    // this.state.columnSelectedState.forEach((element: any) => {
    //   let valuehasMatchedForColumn: any = false;
    //   if(this.props.userSelectedColumn && this.props.userSelectedColumn.length > 0 ) {
    //   this.props.userSelectedColumn &&
    //     this.props.userSelectedColumn.forEach((value: any) => {
    //       if (value.appModuleSettingID === element.id && value.active === element.active) {
    //         valuehasMatchedForColumn = true;
    //       }
    //     });

    //   if (valuehasMatchedForColumn) {
    //     element.isChecked = true;
    //   } else {
    //     element.isChecked = false;
    //   } 
    // } else  {
    //   element.isChecked = true;
    //   }

    // })


    if (nextProps.clearSelected === true) {
      this.setState({
        selectedRows: []
      })
    }
    let selectedRowsCopy = this.state.selectedRows ? [...this.state.selectedRows] : [];
    if (nextProps.databody.hasOwnProperty('results')) {
      nextProps.databody.results.map((singlePath: any) => {
        let index = selectedRowsCopy.findIndex((item: any) => item.learningPath.pathId === singlePath.learningPath.pathId);
        if(index > -1) {
          singlePath["selected"] = true;
          selectedRowsCopy[index] = singlePath;
        }
        return singlePath;
      })
    }

    if (this.state.pathRefsId !== nextProps.pathRefId) {
      this.setState({
        selectedRows: []
      })
    }


    this.setState({
      selectedRows: selectedRowsCopy,
      dataBody: nextProps.databody,
      totalPages: nextProps.databody.totalPages,
      sortingColumn: nextProps.sortColumn,
      sortingOrder: nextProps.sortOrder === "asc" ? true : false,
      currentPageNo: nextProps.currentPageNo,
      currentMetaPageNo: nextProps.currentMetaPageNo,
      metadataHeader: nextProps.metadataHeader,
      metadataGrid: nextProps.metadataGrid,
      metadataValue: nextProps.metadataValue,
      sortingMetaDataColumn: nextProps.sortMetaDataColumn,
      sortingMetaDataOrder:
        nextProps.sortMetaDataOrder === "asc" ? true : false,
      pathRefsId: nextProps.pathRefId,
    });
    if (
      nextProps.databody.hasOwnProperty("totalCount") &&
      nextProps.databody.totalCount !== this.state.totalCount
    ) {
      this.setState({
        totalCount: nextProps.databody.totalCount,
      });
    }
    this.createWidth(nextProps.metadataHeader);
  }

  createMasterData(metadataHeader: any, metadataGrid: any) {
    var headerArray: any = ["title"];
    var valueArray: any = [];

    if (metadataHeader.length > 0) {

      for (let k = 0; k < metadataHeader.length; k++) {
        for (let l = 0; l < metadataHeader[k].metadataDefinitions.length; l++) {
          if(!ignoreMetadataLabel.includes(metadataHeader[k].metadataDefinitions[l].label)){
            headerArray.push(metadataHeader[k].metadataDefinitions[l].metadataId);
          }
        }
      }
    }

    if (Object.keys(metadataGrid).length > 0) {
      for (let m = 0; m < metadataGrid.results.length; m++) {
        let value = [];
        for (let n = 0; n < metadataGrid.results[m].metadata.length; n++) {
          if(!ignoreMetadataLabel.includes(metadataGrid.results[m].metadata[n].label)){
            value.push({
              metadataDefinitionId:
                metadataGrid.results[m].metadata[n].metadataDefinitionId,
              value: metadataGrid.results[m].metadata[n].value,
            });
          }
        }
        valueArray.push(value);
      }
    }

    if (headerArray.length > 0 && valueArray.length > 0) {
      var master = [];
      for (var i = 0; i < valueArray.length; i++) {
        var tupple = [];
        let currentRow = valueArray[i];
        for (var j = 0; j < headerArray.length; j++) {
          var notFound = true;
          if (j === 0) {
            tupple.push([
              metadataGrid.results[i].learningPath.name,
              metadataGrid.results[i].learningPath.pathId,
              metadataGrid.results[i].learningPath.version,
              metadataGrid.results[i].learningPath.def.id,
              metadataGrid.results[i].learningPath.entityAttributes
            ]);
            continue;
          }
          for (var k = 0; k < currentRow.length; k++) {
            if (headerArray[j] === currentRow[k].metadataDefinitionId) {
              try {
                tupple.push(JSON.parse(currentRow[k].value).join(","));
              } catch (e) {
                tupple.push(currentRow[k].value);
              }

              notFound = false;
              break;
            }
          }
          if (notFound) {
            tupple.push("");
          }
        }
        master.push(tupple);
      }
      return master;
    }
  }

  onHandlePaginationNumbers = (e: any) => {
    if (e) {
      this.setState({
        currentPageNo: e - 1,
      });
      this.props.nextPage(e - 1);
    }
  };

  onNextBtnClick = () => {
    if (this.state.currentPageNo < this.state.totalPages) {
      this.setState({
        currentPageNo: this.state.currentPageNo + 1,
      });
      this.props.nextPage(this.state.currentPageNo + 1);
    }
  };

  onPrevBtnClick = () => {
    if (this.state.currentPageNo > 0) {
      this.setState({
        currentPageNo: this.state.currentPageNo - 1,
      });
      this.props.prevPage(this.state.currentPageNo - 1);
    }
  };

  onNextMetaBtnClick = () => {
    if (this.state.currentMetaPageNo < this.state.metadataGrid.totalPages) {
      this.setState({
        currentMetaPageNo: this.state.currentMetaPageNo + 1,
      });
      this.props.nextMetaPage(this.state.currentMetaPageNo + 1);
    }
  };

  onPrevMetaBtnClick = () => {
    if (this.state.currentMetaPageNo > 0) {
      this.setState({
        currentMetaPageNo: this.state.currentMetaPageNo - 1,
      });
      this.props.prevMetaPage(this.state.currentMetaPageNo - 1);
    }
  };

  onSortableBtnClick = (columnName: any, type: any = "path") => {
    let sortOrder = true;
    if ((this.state.sortingColumn.toLowerCase() === columnName.toLowerCase()) 
      || (columnName === "Updated By" && this.state.sortingColumn === "modifiedBy")
      || (columnName === "Updated At" && this.state.sortingColumn === "modifiedAt")) {
      sortOrder = !this.state.sortingOrder;
    }
    this.setState({
      sortingColumn: columnName,
      sortingOrder: sortOrder,
    });
    if (columnName === "Updated At") {
      this.props.sortableEvent("modifiedAt", sortOrder, "meta");
    } else if (columnName === "Updated By") {
      this.props.sortableEvent("modifiedBy", sortOrder, "meta");
    } else if (columnName === "Status") {
      this.props.sortableEvent("status", sortOrder, "meta");
    } else if (columnName === "Project") {
      this.props.sortableEvent("project", sortOrder, "meta");
    } else {
      this.props.sortableEvent(columnName, sortOrder, "meta");
    }
  };

  onChangePerPagecount = (pageCount: any) => {
    if (this.state.pageSize !== pageCount) {
      this.setState({ pageSize: pageCount });
      this.props.numberOfItemPagination(pageCount);
    }
  };

  onChangePerPagecountMeta = (pageCount: any) => {
    if (this.state.metadataGrid.size !== pageCount) {
      this.setState({ pageSizeMeta: pageCount });
      this.props.numberOfItemPaginationMeta(pageCount);
    }
  };

  setUserDesigner(url: any, language: any, annotations: any,viewOnlyMode:boolean ) {
    localStorage.setItem("AnnotationsProperty", annotations);
    localStorage.setItem("DoLittleLanguageSelection", language);
    let storeMe = {
      viewOnlyMode: viewOnlyMode
    }
    
    localStorage.setItem("viewOnlyMode",JSON.stringify(storeMe))
    this.setState({ redirect: url });
  }

  setUserStudent(url: any, language: any, annotations: any) {
    localStorage.setItem("AnnotationsProperty", annotations);
    localStorage.setItem("DoLittleLanguageSelection", language);
    this.setState({ redirect: url });
  }

  setUserMpng(url: any, annotations: any) {
    localStorage.setItem("AnnotationsPropertyMPNG", annotations);
    this.setState({ redirect: url });
  }

  showMetaPopup = (pathId: any, pathTitle: any, version: any, pathDefId: any, userType: any) => {
    this.props.setShowMetaPopup(pathId, pathTitle, version, pathDefId, userType);
  };

  createWidth = (header: any) => {
    var headerArray: any = ["title"];
    if (header.length > 0) {
      for (let i = 0; i < header.length; i++) {
        for (let j = 0; j < header[i].metadataDefinitions.length; j++) {
          headerArray.push(header[i].metadataDefinitions[j].metadataId);
        }
      }
    }
    let headerLength = headerArray.length;
    let windowInnerWidth = window.innerWidth - 30;

    if (headerLength > 5) {
      if (headerLength * 200 < windowInnerWidth) {
        this.setState({
          greaterThanFive: true,
          columnWidth: windowInnerWidth / headerLength,
          totalWidth: windowInnerWidth,
        });
      } else {
        this.setState({
          greaterThanFive: true,
          columnWidth: 200,
          totalWidth: headerLength * 200,
        });
      }
    } else {
      this.setState({
        greaterThanFive: false,
        totalWidth: windowInnerWidth,
        columnWidth: windowInnerWidth / headerLength,
      });
    }
  };

  onChangePathVersion(url: any, versionValue: any, annotations: any) {
    localStorage.setItem("AnnotationsPropertyMPNG", annotations);
    this.setState({
      pathVersionUrl: url,
      pathVersionNumber: versionValue,
    });
  }

  onInspectBtnClick(product_id: any, path_id: any, pathName: any, pathType: any, pathRefId: any, entityData: any, isLock: any) {
    this.props.pageHistory.push('/path/' + product_id + '/' + path_id + '/lesson', { productId: this.props.productId, pathName: pathName, pathType: pathType, redirectFrom: 'content', mpngThemeValue: this.props.mpngThemeValue, pathRefId: pathRefId, activePath: pathRefId, launchLanguage: this.props.launchLanguage, entityData: entityData, isLock: isLock });
  }
  setLockStatus(lessonInfo: lessonData) {
    let flag: boolean = false;
    lessonInfo.entityAttributes.forEach((singleElement: entityAttributes) => {
      if (singleElement.definitionId === this.props.lockunlockDefinitionId) {
        singleElement.value === "lock"? flag = true : flag = false;
      }
    })
    return flag;
  }
  selectAllRows(targetChecked: boolean) {
    let lockedState: boolean;
    if (targetChecked) {
      this.state.dataBody.results.map((singleData: any) => {
        lockedState = this.setLockStatus(singleData.learningPath);
        if(lockedState){
          singleData.selected = false;
        }else{
          singleData.selected = true;
        }       
        return singleData
      })
    } else {
      this.state.dataBody.results.map((singleData: any) => {
        singleData.selected = false;
        return singleData
      })
    }
    let seletedElem: any[] = [];
    this.state.dataBody.results.forEach((item: any) => {
      if (item.selected) {
        seletedElem.push(item);
      }
    })
    this.setState({
      dataBody: this.state.dataBody,
      selectedRows: seletedElem
    })
  }

  selectSingleRow(targetChecked: boolean, rowIndex: any) {
    let dataBody = this.state.dataBody
    if (targetChecked) {
      dataBody.results[rowIndex].selected = true;
    } else {
      dataBody.results[rowIndex].selected = false;
    }
    let seletedElem: any[] = [];
    dataBody.results.forEach((item: any) => {
      if (item.selected) {
        seletedElem.push(item);
      }
    })

    this.setState({
      dataBody,
      selectedRows: seletedElem,
    })
  }

  onScroll(scrollOffset: any) {
  // eslint-disable-next-line
    this.state.tableMetaRef.current.scrollLeft += scrollOffset;
  }

  handleChangeSelectedColumn = (e: any, i: any) => {
    if (e) {
      this.setState({
        activeSaveColumnButton: false,
      });
    }
    let trueFalseCheckboxValueCheck = this.state.columnSelectedState;
    trueFalseCheckboxValueCheck[i].isChecked = !trueFalseCheckboxValueCheck[i].isChecked;
    this.setState({ columnSelectedState: trueFalseCheckboxValueCheck });
  }

  saveColumn = (e: any) => {
    e.preventDefault();
    let finalColumnSelection: any = {
      moduleSettings: [
        {
          appModuleID: this.state.appModuleID,
          userModuleSettings: [],
        },
      ],
      productID: 0,
    };
    this.state.columnSelectedState.map((ele: any) => {
      if (ele.isChecked === true) {
        let formatterJson = {
          appModuleSettingID: ele.id,
        };
        finalColumnSelection.moduleSettings[0].userModuleSettings.push(
          formatterJson
        );
      }
      return "";
    });

    cosmosApiService
      .userSelectedColumnPersonalization(
        finalColumnSelection,
        this.props.oktaUserId
      )
      .then((res: any) => res.json())
      .then((responseData: any) => {
        console.log("responseData", responseData);
      });
    this.props.setParentRendering((value: any) => !value);
    this.setState({
      currentComponentReRender: !this.state.currentComponentReRender,
      activeSaveColumnButton: true
      // showColumnSelectionDropdown: false
    });
  }

  onChangeResetColumns = (e: any) => {
    e.preventDefault();
    let allCheckboxTrue = this.state.columnSelectedState;
    allCheckboxTrue && allCheckboxTrue.forEach((value: any) => {
      value.isChecked = true;
    })
    this.setState({ columnSelectedState: allCheckboxTrue });
    this.saveColumn(e);
  }

  //  hideShowColumnPersonalizationDropdown = () => {
  //   console.log('hideShowColumnPersonalizationDropdown', this.state.showColumnSelectionDropdown);
  //   this.setState({
  //     showColumnSelectionDropdown: true
  //   });
  // }

  constructDataForParentChildLock = (lessionData: any, entityData: any) => {
    let restructure: any = [];
    let lockObject = {definitionId: this.props.lockunlockDefinitionId, value:"lock"};
    lessionData && lessionData.forEach((element: any) => {
      let entityAttributes: any = [];
      if(element?.entityAttributes?.length > 0) {
        let detected: boolean = false;
        element?.entityAttributes?.forEach((data: any) => {
          if(data.definitionId === this.props.lockunlockDefinitionId) {
            entityAttributes.push ({
              definitionId: data.definitionId,
              value: "lock"
            })
            detected = true;
          } else {
            entityAttributes.push ({
              definitionId: data.definitionId,
              value: data.value
            })
          }
        })
        if(!detected) {
          entityAttributes.push(lockObject)
        }
      } else {
        entityAttributes.push(lockObject)
      }
      let object1 = {
        pathID: element.pathId,
        val1: entityAttributes
      }
      restructure.push(object1);
    })

    let lockUnlockPath: any = {};
    let workFlowStatusDataObject :any = {};
    let projectWorkFlowStatusDataObject : any = {};

    lockUnlockPath = { definitionId: this.props.lockunlockDefinitionId, value: "lock" }


    entityData.learningPath?.entityAttributes?.filter((data: any) => {
      if(data.name === "workflow-status") {
        workFlowStatusDataObject = {definitionId:data.definitionId,value:data.value}
      }
      return workFlowStatusDataObject;
    })

    entityData.learningPath?.entityAttributes?.filter((data:any) => {
        if(data.name === "project-workflow-status"){
           projectWorkFlowStatusDataObject = {definitionId:data.definitionId,value:data.value};
        }
        return projectWorkFlowStatusDataObject
      });

      if(Object.keys(workFlowStatusDataObject).length === 0){
        workFlowStatusDataObject.definitionId = this.props.workFlowDefinitionId;
        workFlowStatusDataObject.value = "";
       }
    
       if(Object.keys(projectWorkFlowStatusDataObject).length === 0){
        projectWorkFlowStatusDataObject.definitionId = this.props.projectdefinitionId;
        projectWorkFlowStatusDataObject.value = "";
       }

       if(Object.keys(lockUnlockPath).length === 0){
        lockUnlockPath.definitionId = this.props.lockunlockDefinitionId;
        lockUnlockPath.value = "";
       }

       restructure.push({
        pathID: entityData.learningPath?.pathId,
        val1: [lockUnlockPath, workFlowStatusDataObject,projectWorkFlowStatusDataObject]
      });
    
      restructure && restructure.map( async (property: any) => {
        await cosmosApiService
          .getContentInDesignerMode(this.props.userEmail, 0)
          .then((res: any) => res.json())
          .then((result: any) => {
            const token = result.token;
            const link = createApolloMiddleware(token).concat(
              createHttpLinkApollo(this.props.doolittleBaseUrl)
            );
            let client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
              cache: new InMemoryCache(),
              link,
            });
            client
              .query({
                query: changeAttributes(property.pathID,property.val1),
                fetchPolicy: "no-cache",
              })
              .then((res) => {
                console.log('successfull');
              });
          });
        })
        this.props.setParentRendering((value: any) => !value);
        this.setState({
          currentComponentReRender: !this.state.currentComponentReRender,
        });

  }

  onLock = (entityData: any) => {
    if (!this.props.userPermission.isAdmin) {
      const message = `Once locked, only users with CQA or Publish permissions will be able to unlock. You have ${this.props.userPermission.contentManagement} permission.  Are you sure you want to lock it?`;
      this.setState({
        form: <MessageComponent
        parentTitle={'Lock Content'}
        children={(
          <p className="mb-2 text-wrap">{message}</p>
        )}
        onClose={() => {
          this.setState({ showModal: false });
        }}
        onSave={() => {
          this.setState({ showModal: false });
          this.handleLockParentPath(entityData)
        }}
        />
      }, () => {
        this.setState({
          showModal: true
        })
      })  
    } else {
      this.handleLockParentPath(entityData)
    }
  }

  handleLockParentPath = (entityData: any) => {
    let lessionData: any;
    if (entityData){
    cosmosApiService
      .getContentInDesignerMode(this.props.userEmail, entityData.learningPath?.pathId)
      .then((res: any) => res.json())
      .then((result: any) => {
        const token = result.token;
        const link = createApolloMiddleware(token).concat(
          createHttpLinkApollo(this.props.doolittleBaseUrl)
        );
      let client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        cache: new InMemoryCache(),
        link,
      });
      client
        .query({
          query: getLessionMeta(entityData.learningPath?.pathId, entityData.version),
          fetchPolicy: "no-cache",
        })
        .then((res) => {
          lessionData = res.data.pathChildren !== null ? res.data.pathChildren.results : []
          this.constructDataForParentChildLock(lessionData, entityData);
        });
      });
      
    }
    this.props.setParentRendering((value: any) => !value);
    this.setState({
      currentComponentReRender: !this.state.currentComponentReRender,
    });     
  }
  
   handleLockPath = (entityData: any) => { 
    let lockUnlockPath: any = {};
    let workFlowStatusDataObject :any = {};
    let projectWorkFlowStatusDataObject : any = {};

    lockUnlockPath = { definitionId: this.props.lockunlockDefinitionId, value: "unlock" }


    entityData.learningPath?.entityAttributes?.filter((data: any) => {
      if(data.name === "workflow-status") {
        workFlowStatusDataObject = {definitionId:data.definitionId,value:data.value}
      }
      return workFlowStatusDataObject;
    })

    entityData.learningPath?.entityAttributes?.filter((data:any) => {
        if(data.name === "project-workflow-status"){
           projectWorkFlowStatusDataObject = {definitionId:data.definitionId,value:data.value};
        }
        return projectWorkFlowStatusDataObject
      });

      if(Object.keys(workFlowStatusDataObject).length === 0){
        workFlowStatusDataObject.definitionId = this.props.workFlowDefinitionId;
        workFlowStatusDataObject.value = "";
       }
    
       if(Object.keys(projectWorkFlowStatusDataObject).length === 0){
        projectWorkFlowStatusDataObject.definitionId = this.props.projectdefinitionId;
        projectWorkFlowStatusDataObject.value = "";
       }

       if(Object.keys(lockUnlockPath).length === 0){
        lockUnlockPath.definitionId = this.props.lockunlockDefinitionId;
        lockUnlockPath.value = "";
       }

       cosmosApiService
        .getContentInDesignerMode(this.props.userEmail, 0)
        .then((res: any) => res.json())
        .then((result: any) => {
          const token = result.token;
          const link = createApolloMiddleware(token).concat(
            createHttpLinkApollo(this.props.doolittleBaseUrl)
          );
          let client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
            cache: new InMemoryCache(),
            link,
          });
          client
            .query({
              query: changeAttributes(entityData.learningPath?.pathId,[lockUnlockPath, workFlowStatusDataObject,projectWorkFlowStatusDataObject]),
              fetchPolicy: "no-cache",
            })
            .then((res) => {
              console.log('successfull');
            });
        });
        this.props.setParentRendering((value: any) => !value);
        this.setState({
          currentComponentReRender: !this.state.currentComponentReRender,
        });

  }
  onConvert =(data: string) => {
    let finalValue = data;
    if(finalValue.includes("[")){
        let result =JSON.parse(finalValue);
        return result.join(", ");
    }
    else {
      return finalValue;
    }
  }

  render() {
   
    let headerIndexCount = 0;
    let sortClass = "sorting";
    let sortClass1 = "sorting";
    let pathCustomSettingsInspect = this.props.pathDetails;
    const { pathVersionUrl, pathVersionNumber } = this.state;
    const { mpngThemeValue, launchLanguage } = this.props;
    
    if (this.state.redirect) {
      this.props.pageHistory.push(this.state.redirect, {
        productId: this.props.productId,
        mpngThemeValue: mpngThemeValue,
        launchLanguage: launchLanguage,
        userPermission: this.props.userPermission,
        dropdownValue: this.props.dropDownValue
      });
    }
    let masterArray = this.createMasterData(
      this.state.metadataHeader,
      this.state.metadataGrid
    );

    if (pathVersionUrl) {
      this.props.pageHistory.push(`${pathVersionUrl}`, {
        productId: this.props.productId,
        pathVersionNumber: pathVersionNumber,
        dropdownValue: this.props.dropDownValue
      });
    }
    let activityTypeArrPosition = -1;
    let languageArrayPosition = -1;
    let annotationsArrayPosition = -1;

    const pageNumbers: any = [];
    if (this.state.totalPages <= 3) {
      for (let page = 1; page <= this.state.totalPages; page++) {
        pageNumbers.push(page);
      }
    } else {
      if (this.state.totalPages - this.state.currentPageNo < 3) {
        for (
          let page = this.state.totalPages - 2;
          page <= this.state.totalPages;
          page++
        ) {
          if (pageNumbers.length < 3) {
            pageNumbers.push(page);
          }
        }
      } else if (this.state.totalPages - this.state.currentPageNo === 3) {
        for (
          let page = this.state.totalPages - 3;
          page < this.state.totalPages;
          page++
        ) {
          if (pageNumbers.length < 3) {
            pageNumbers.push(page);
          }
        }
      } else {
        for (
          let page = this.state.currentPageNo;
          page <= this.state.currentPageNo + 3;
          page++
        ) {
          if (
            page <= this.state.totalPages &&
            page !== 0 &&
            pageNumbers.length < 3
          ) {
            pageNumbers.push(page);
          }
        }
      }
    }

    let annotationFlagCheck: any = [];
    for (let i = 0; i < this.state.metadataHeader.length; i++) {
      for (let j = 0; j < this.state.metadataHeader[i].metadataDefinitions.length; j++) {
        if (this.state.metadataHeader[i].metadataDefinitions[j].label === "Annotations") {
          if (this.state.dataBody) {
            this.state.dataBody.results?.map((value: any, index: any) => {
              annotationFlagCheck[index] = "";
              value?.metadata?.map((meta: any) => {
                if (meta.label) {
                  if (meta.label.toLowerCase() === "annotations") {
                    annotationFlagCheck[index] = meta.hasOwnProperty("value")
                      ? meta.value
                      : "";
                  }
                }
                return "";
              });

              return '';
            })
          }
        }
      }
    }

    let selectedColumnRedefined: any = [];
    if (
      this.props.userSelectedColumn &&
      this.props.userSelectedColumn.length <= 0
    ) {
      selectedColumnRedefined = this.state.dataHeader;
    } else {
      selectedColumnRedefined.push({ name: "name", text: "Title", sort: true });
      this.state.dataHeader.forEach((element: any) => {
        this.props.userSelectedColumn &&
          this.props.userSelectedColumn.forEach((valueOne: any) => {
            if (element.id === valueOne.appModuleSettingID && element.active === valueOne.active) {
              selectedColumnRedefined.push(element);
            }
          });
      });
    }

    const matchingDataForColumnPersonalization = (value: any) => {
      return (
        selectedColumnRedefined &&
        selectedColumnRedefined.some(function (el: any) {
          return el.text === value;
        })
      );
    } 

    return (
      <React.Fragment>

        <CosModal
          customClass={''}
          autoSize={true}
          show={this.state.showModal}
          children={this.state.form}
          onClose={() => this.setState({showModal: false})}
        />

        <div
          className={`table-wrap ${this.state.metadataValue ? "d-none" : ""}`}
        >
          {this.props.isBulkUpdateEnabled && this.state.selectedRows.length > 0 && <div className="All-checkbox-holder">
            <div className="All-checkbox-inner d-flex align-items-center p-2 cosmos-clear-selection">
              <p className="mb-0 pr-4">{this.state.selectedRows.length} Selected</p>
              <button className="button-transparent btn-default font-weight-bold pr-4" onClick={() => this.selectAllRows(true)}>
                Select All
              </button>
              <button className="button-transparent btn-default font-weight-bold pr-4 cosmos-clear-button" onClick={() => this.selectAllRows(false)}>
                Clear Selection
              </button>
              <button
                className="button-transparent btn-default font-weight-bold pr-4 pl-4"
                onClick={() => this.props.setBulkUpdateMetaModal(this.state.selectedRows)}
              >
                Edit Metadata
              </button>
              {/* <button
                className="button-transparent btn-default font-weight-bold pr-4"
                //onClick={() => this.props.setBulkUpdateAliasModal(this.state.selectedRows)}
              >
               Edit Status
              </button> */}
              <button
                className="button-transparent btn-default font-weight-bold pr-4"
                onClick={() => this.props.setBulkUpdateAliasModal(this.state.selectedRows)}
              >
               Save Version
              </button>
              <button
                className="button-transparent btn-default font-weight-bold pr-4"
                onClick={() => this.props.setBulkUpdatePathAttributes(this.state.selectedRows)}
              >
               Publishing Status
              </button>
            </div>
          </div>}

          <div
            className="cos-modal-font modal fade"
            id="exampleModal"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title h4" id="exampleModalLabel">
                    Bulk Update - Metadata
                  </h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label className="form-label">
                        META TYPE <span className="colorRed">*</span>
                      </label>
                      <input
                        name="title"
                        id="formBasicEmail"
                        className="form-control-plaintext"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        VALUE <span className="colorRed">*</span>
                      </label>
                      <input
                        name="title"
                        id="formBasicEmail"
                        className="form-control-plaintext"
                      />
                    </div>

                    <p className="color-lightnavy">
                      Note: X number of records will be changed when you click
                      save. This cannot be undone.
                    </p>
                  </form>
                </div>
                <div className="d-flex justify-content-between modal-footer">
                  <button
                    type="button"
                    className="button button-default"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" className="button button-primary">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="table-container table-main tableFixHeader_datatable">
            <table className="all-product-detail custom-added-width">
              <thead>
                <tr>
                  {selectedColumnRedefined
                    .filter(
                      (value: any) =>
                        this.props.isJiraIntegrationEnabled ||
                        value.text !== "Ticket Status" ||
                        value.name !== "name"
                    )
                    .map((value: any, index: any) => {
                      if (value.sort === true) {
                        if (this.state.sortingOrder !== true) {
                          sortClass = "sortingreverse";
                        } else {
                          sortClass = "sorting"
                        }
                        return (
                            <th key={"selectedColumnRedefined"+index}>
                              <div className="d-flex align-items-center">
                                <div className="custom-width-title">
                                  <span
                                    className="d-inline-block"
                                    onClick={() =>
                                      this.onSortableBtnClick(value.name)
                                    }
                                    tabIndex={0}
                                  >
                                    {value.text + " "}
                                    {(this.state.sortingColumn.toLowerCase() === value.name.toLowerCase() 
                                      || (value.name === "Updated By" && this.state.sortingColumn === "modifiedBy")
                                      || (value.name === "Updated At" && this.state.sortingColumn === "modifiedAt")) && (
                                      <span
                                        className={
                                          "position-relative " + sortClass
                                        }
                                        aria-hidden="true"
                                      ></span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </th>
                        );
                      } else {
                        if (value.text === "Ticket Status" && this.props.isJiraIntegrationEnabled) {
                          return <th key={index}>{value.text}</th>
                        } else if (value.text === "Alias") {
                          return <th key={index}>Environment</th>;
                        }
                        return ""
                      }
                    })}
                  <th className="font-weight-normal">
                    <div className="dropdown all-content-columns float-right">
                      <button
                        className="btn btn-default dropdown-toggle btn-column cos-font-14"
                        type="button"
                        id="dropdownColumn"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      // onClick={() => this.hideShowColumnPersonalizationDropdown()}
                      >
                        Columns
                        <span className="material-icons custom-arrow downarrow">keyboard_arrow_down</span>
                        <span className="material-icons custom-arrow uparrow">keyboard_arrow_up</span>
                      </button>
                      {
                        //  this.state.showColumnSelectionDropdown && 
                        <div
                          className="dropdown-menu dropdown-menu-right dropdown-column cos-font-14"
                          aria-labelledby="dropdownColumn"
                        >
                          <form>
                            <div>
                              <div className="d-flex justify-content-between align-items-end mb-1">
                                <span className="color-lightgrey">
                                  <span className="material-icons color-lightgrey custom-lock-icon cos-font-14 pr-1">
                                    lock
                                  </span>
                                  <span>Title</span>
                                </span>
                                <div>
                                  <button className="button button-transparent cos-font-12 p-0 color-blue" onClick={(e: any) => this.onChangeResetColumns(e)}>Reset</button>
                                </div>
                              </div>
                            </div>

                            {this.state.columnSelectedState.map((data: any, i: any) => {
                              if (data.text === "Ticket Status" && this.props.isJiraIntegrationEnabled) {
                                return (
                                  <div className="form-check pb-1 pt-1" key={"columnSelectedState"+i}>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={data.id}
                                      value={data.id}
                                      checked={data.isChecked}
                                      onChange={(e) => this.handleChangeSelectedColumn(e, i)}
                                    />
                                    <label className="form-check-label">{data.text}</label>
                                  </div>
                                );
                              } else if (data.text !== "Ticket Status") {
                                return (
                                  <div className="form-check pb-1 pt-1" key={i}>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={data.id}
                                      value={data.id}
                                      checked={data.isChecked}
                                      onChange={(e) => this.handleChangeSelectedColumn(e, i)}
                                    />
                                    <label className="form-check-label">{data.text === "Alias" ? "Environment" : data.text}</label>
                                  </div>
                                );

                              }
                              return ""

                            })}

                            <div className="mt-3 d-flex">
                              <button
                                disabled={this.state.activeSaveColumnButton === true ? true : false}
                                onClick={(e: any) => this.saveColumn(e)}
                                className="button button-primary cos-font-14 mx-auto"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </div>}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(this.state.dataBody).length > 0 &&
                  this.state.dataBody.results.map((value: any, index: any) => {
                    let activityType = "";
                    let languageValue: any = [];
                    let isLock: any;
                    value?.metadata?.map((meta: any) => {
                      if (meta.label) {
                        if (meta.label.toLowerCase() === "activity type") {
                          activityType = meta.hasOwnProperty("value")
                            ? meta.value
                            : "";
                        }
                      }
                      if (meta.label) {
                        if (meta.label.toLowerCase() === "language") {
                          let tempVal = meta.hasOwnProperty("value")
                            ? meta.value
                            : "";
                          languageValue.push(tempVal);
                        }
                      }
                      return "";
                    });
                    value.learningPath.entityAttributes?.map((element: any) => {
                      if(element.definitionId === this.props.lockunlockDefinitionId) {
                        // isLock = element.value.toLowerCase();
                        isLock = element.value.toLowerCase() === "lock" ? true : false;
                      }
                      return ""
                    })

                    return (
                      <tr key={index}>
                        {this.props.dropDownValue === "MPNG" ? (
                          <td>
                            <div className="d-flex align-items-center bd-highlight align-self-baseline cosmosAllContentTitle">
                              { 
                                !isLock &&
                                this.props.isBulkUpdateEnabled &&
                                this.props.userPermission.contentManagement !== "Read Only" && (
                                  <input
                                    type="checkbox"
                                    checked={value.selected}
                                    className="mr-2 bd-highlight"
                                    onChange={(e: any) => this.selectSingleRow(e.target.checked, index)}
                                  />
                                )
                              }
                              <Link
                                className="flex-grow-1 bd-highlight cosmos-custom-tooltip pt-0"
                                style={{marginLeft: `${this.props.userPermission.contentManagement !== "Read Only" && isLock && "20px"}`}}
                                to={"#"}
                                onClick={() =>
                                  this.setUserMpng(
                                    "/mpngReader/" +
                                    value.learningPath.pathId +
                                    "/" +
                                    encodeURIComponent(value.learningPath.name) +
                                    "/" +
                                    activityType,
                                    annotationFlagCheck[index]
                                  )
                                }
                              >
                                {value.learningPath.name}
                                <span className="tooltiptext tooltip-allcontent-title">Preview</span>
                              </Link>
                              {isLock && (
                                <div className="bd-highlight cosmos-lock-tooltipAllContent">
                                <div className="bd-highlight">
                                  <i className="fa fa-lock fa-lg cosmos-icon-theme ml-3" aria-hidden="true"></i>
                                  <span className="tooltiptext tooltip-allcontent">This Item is locked</span>
                                </div>
                                </div>
                              )}
                            </div>
                          </td>
                        ) : (
                          <td>
                            <div className="d-flex align-items-center bd-highlight align-self-baseline cosmosAllContentTitle">
                              {
                                !isLock &&
                                this.props.isBulkUpdateEnabled &&
                                this.props.userPermission.contentManagement !== "Read Only" && (
                                  <input
                                    type="checkbox"
                                    checked={value.selected}
                                    className="mr-2 mt-1 bd-highlight"
                                    onClick={(e: any) => this.selectSingleRow(e.target.checked, index)}

                                  />
                                )
                              }
                              {
                               this.props.dropDownValue === "CWNG" ? 
                                  <Link
                                  className="flex-grow-1 bd-highlight cosmos-custom-tooltip pt-0"
                                  style={{marginLeft: `${this.props.userPermission.contentManagement !== "Read Only" && isLock && "20px"}`}}
                                  to={
                                  "/cwngReader/" +
                                  value.learningPath.pathId +
                                  "/student/" +
                                  encodeURIComponent(value.learningPath.name)
                                  }
                                  onClick={() =>
                                    {
                                      const data = {
                                        productId: this.props.productId,
                                        dropdownValue: this.props.dropDownValue,
                                      }
                                      localStorage.setItem('readerInfo', JSON.stringify(data));
                                      localStorage.setItem("AnnotationsProperty", languageValue[0]);
                                      localStorage.setItem("DoLittleLanguageSelection", annotationFlagCheck[index])
                                    }
                                  }
                                >
                                  {value.learningPath.name}
                                  <span className="tooltiptext tooltip-allcontent-title">Preview</span>
                                </Link>
                             :
                              <Link
                                className="flex-grow-1 bd-highlight cosmos-custom-tooltip pt-0"
                                style={{marginLeft: `${this.props.userPermission.contentManagement !== "Read Only" && isLock && "20px"}`}}
                                to={"#"}
                                onClick={() =>
                                  this.setUserStudent(
                                    "/reader/" +
                                    value.learningPath.pathId +
                                    "/student/" +
                                    encodeURIComponent(value.learningPath.name),
                                    languageValue[0],
                                    annotationFlagCheck[index]
                                  )
                                }
                              >
                                {value.learningPath.name}
                                <span className="tooltiptext tooltip-allcontent-title">Preview</span>
                              </Link>
                              } 
                              
                              {isLock && (
                                <div className="bd-highlight cosmos-lock-tooltipAllContent">
                                <div className="bd-highlight">
                                  <i className="fa fa-lock fa-lg cosmos-icon-theme ml-3" aria-hidden="true"></i>
                                  <span className="tooltiptext tooltip-allcontent">This Item is locked</span>
                                </div>
                                </div>
                              )}
                            </div>
                          </td>
                        )}

                        {matchingDataForColumnPersonalization("Ticket Status") && this.props.isJiraIntegrationEnabled && (
                          <td>
                            <JiraStatus
                              pathId={value.learningPath.pathId}
                              setShowJiraModal={this.props.setShowJiraModal}
                            />
                          </td>
                        )}

                        {matchingDataForColumnPersonalization("Status") && <td>
                          {value.learningPath.entityAttributes.map((data: any, index: any) => (
                            <span key={index}>{data.name === "workflow-status" && data.value !== 'Work status (not set yet)' && data.value !== "null" &&  data.value}</span>
                          ))}
                        </td>}

                        {matchingDataForColumnPersonalization("Alias") && <td className="versionNum">
                          {value.learningPath.aliases.map(
                            (val: any, idx: number) => {
                              return (
                                <React.Fragment  key={"aliases"+idx}>
                                  {this.props.dropDownValue === "MPNG" ? (
                                    <Link
                                      to={"#"}
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        this.onChangePathVersion(
                                          "/mpngReader/" +
                                          value.learningPath.pathId +
                                          "/" +
                                          encodeURIComponent(value.learningPath.name) +
                                          "/" +
                                          val.version,
                                          val.version,
                                          annotationFlagCheck[index]
                                        );
                                      }}
                                    >
                                      {val.alias !== "" && <p key={idx}>{`${val.alias}(${val.version})`}</p>}
                                    </Link>
                                  ) : (

                                     this.props.dropDownValue === "CWNG" ? 
                                      <Link
                                            className="flex-grow-1 bd-highlight"
                                            style={{marginLeft: `${this.props.userPermission.contentManagement !== "Read Only" && isLock && "20px"}`}}
                                            to={
                                              "/cwngReader/" +
                                              value.learningPath.pathId +
                                              "/student/" +
                                              encodeURIComponent(value.learningPath.name) +
                                              "/" +
                                              val.version
                                            }
                                            onClick={() =>
                                              {
                                                const data = {
                                                  pathVersionNumber:val.version,
                                                  dropdownValue: this.props.dropDownValue,
                                                }
                                                localStorage.setItem('readerInfo', JSON.stringify(data));
                                                localStorage.setItem("AnnotationsProperty", "");
                                              }
                                            }
                                          >
                                          {val.alias !== "" && <p key={idx}>{`${val.alias}(${val.version})`}</p>}
                                          </Link>
                                        :

                                        <Link
                                          to={"#"}
                                          onClick={(e: any) => {
                                            e.stopPropagation();
                                            this.onChangePathVersion(
                                              "/reader/" +
                                              value.learningPath.pathId +
                                              "/student/" +
                                              encodeURIComponent(value.learningPath.name) +
                                              "/" +
                                              val.version,
                                              val.version,
                                              ""
                                            );
                                          }}
                                        >
                                          {val.alias !== "" && <p key={idx}>{`${val.alias}(${val.version})`}</p>}
                                        </Link>
                                  )}
                                </React.Fragment>
                              );
                            }
                          )}
                        </td>}

                        {matchingDataForColumnPersonalization("Updated At") && <td>
                          {new Intl.DateTimeFormat("en-US", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                            .format(new Date(value.learningPath.modifiedAt))
                            .replace(",", " ")}
                        </td>}
                        {matchingDataForColumnPersonalization("Updated By") && <td>{value.learningPath.modifiedBy}</td>}
                        {matchingDataForColumnPersonalization("Project") && <td>
                          {value.learningPath.entityAttributes.map((data: any, index: any) => (
                            <span key={"entityAttributes"+index}>{data.name === "project-workflow-status" && this.onConvert(data.value)}</span>
                          ))}
                        </td>}
                        <td>
                          <div className="d-flex justify-content-end">
                            <EditButton title="ViewOnly-Mode" className="pendo-allContentViewOnlyMode border-0 cosmos-button-theme cosmos-custom-tooltip" onClick={() => 
                                this.setUserDesigner(
                                  "/reader/" +
                                  value.learningPath.pathId +
                                  "/designer/" +
                                  encodeURIComponent(value.learningPath.name),
                                  languageValue[0],
                                  annotationFlagCheck[index],
                                  true
                                )
                              }>
                            <ViewOnlyBtn />
                            </EditButton>
                          {pathCustomSettingsInspect && pathCustomSettingsInspect === true &&
                            <EditButton title="Inspect" className="pendo-allContentInspect border-0 cosmos-button-theme cosmos-custom-tooltip" onClick={() => this.onInspectBtnClick(this.props.productId, value.learningPath.pathId, value.learningPath.name, this.props.pathRefName, this.props.pathRefId, value.learningPath.entityAttributes, isLock)}>
                              <InspectBtn />
                            </EditButton>}
                           { !isLock && 
                           <EditButton
                              className={`pendo-allContentEdit border-0 cosmos-custom-tooltip ${this.props.userPermission.contentManagement ==="Read Only"? "" : "cosmos-button-theme"}`}
                              disabled={this.props.userPermission.contentManagement ==="Read Only"}
                              onClick={() => 
                                this.setUserDesigner(
                                  "/reader/" +
                                  value.learningPath.pathId +
                                  "/designer/" +
                                  encodeURIComponent(value.learningPath.name),
                                  languageValue[0],
                                  annotationFlagCheck[index],
                                  false
                                )
                              }
                            >
                            <i className={`fa fa-pencil fa-lg ${this.props.userPermission.contentManagement ==="Read Only"? "cosmos-icon-disabled" : "cosmos-icon-theme"}`} aria-hidden="true">
                            <span className="tooltiptext tooltip-allcontent-title tooltip-allcontent-hover cos-font-14">Edit</span>
                            </i>
                            </EditButton> 
                            }

                            <Options
                              propsSentFrom={"itemdetails"}
                              userPermission={this.props.userPermission}
                              renamePathCallback={() => this.props.renamePathCallback(value)}
                              duplicatePathCallback={() => this.props.duplicatePathCallback(value, isLock)}
                              deletePathCallback={() => this.props.deletePathCallback(value)}
                              addToProjectFlow={() => this.props.addToProjectFlow(value.learningPath.entityAttributes, value.learningPath.name, value.learningPath.pathId)}
                              setAliasCallback={() => this.props.setAliasCallback(value)}
                              flatView={() => this.props.flatView(value)}
                              type={this.props.type}
                              WorkstatusFlow={() => this.props.WorkstatusFlow(value.learningPath.entityAttributes, value.learningPath.name, value.learningPath.pathId)}
                              createLinkForm={() => this.props.createLinkForm(value.learningPath)}
                              isMetaData={false}
                              activityType={this.props.type}
                              isLock={isLock}
                              lockPath={()=> isLock ? this.handleLockPath(value)  : this.onLock(value) }
                              
                              singleElement={value}
                              pathCustomSetting={this.props.pathDetails}
                              lockUnlockSinglePathFlagger={this.props.lockUnlockSinglePathFlagger}
                            />

                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>           
          </div>

           {/* Fixed footer */}
          <div className="table-container table-main tableFixHeader_datatable_fixed">
            <table>
              <tr>
                <td colSpan={13} className="border-bottom-0">
                  <div className="custom-pagination d-flex justify-content-end align-items-center gello">
                    <p className="mb-0 mr-4">
                      Viewing Records{" "}
                      {this.state.pageSize * (this.state.currentPageNo + 1) -
                        this.state.pageSize +
                        1}{" "}
                      -{" "}
                      {this.state.pageSize * (this.state.currentPageNo + 1) >
                        this.state.totalCount
                        ? this.state.totalCount
                        : this.state.pageSize *
                        (this.state.currentPageNo + 1)}{" "}
                      of {this.state.totalCount}
                    </p>
                    <ul className="pagination mb-0 mr-4">
                      <li className="page-item">
                        <button
                          className="page-link arrow"
                          aria-label="Previous"
                          onClick={this.onPrevBtnClick}
                          disabled={this.state.currentPageNo === 0}
                        >
                          <FontAwesomeIcon
                            icon={["fal", "chevron-double-left"]}
                          />
                          <span className="sr-only">Previous</span>
                        </button>
                      </li>
                      {pageNumbers &&
                        pageNumbers.map((number: any, idx: any) => {
                          return (
                            <li
                              className={`page-item ${this.state.currentPageNo + 1 === number
                                ? "active"
                                : ""
                                }  `}
                              key={"pageNumbers"+idx}
                            >
                              <button
                                className="page-link"
                                onClick={(e: any) =>
                                  this.onHandlePaginationNumbers(number)
                                }
                              >
                                {number}
                              </button>
                            </li>
                          );
                        })}

                      <li className="page-item">
                        <button
                          className="page-link arrow"
                          aria-label="Next"
                          onClick={this.onNextBtnClick}
                          disabled={
                            this.state.currentPageNo ===
                            this.state.totalPages - 1 ||
                            this.state.totalPages === 0
                          }
                        >
                          <FontAwesomeIcon
                            icon={["fal", "chevron-double-right"]}
                          />
                          <span className="sr-only">Next</span>
                        </button>
                      </li>
                    </ul>

                    <div className="dropdown pagination-dropdown">
                      <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        data-toggle="dropdown"
                      >
                        {this.state.pageSize}
                        <span className="caret active">
                          <FontAwesomeIcon icon={["fal", "chevron-down"]} />
                        </span>
                        <span className="caret colorarrow">
                          <FontAwesomeIcon icon={["fal", "chevron-up"]} />
                        </span>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(200)}
                          >
                            200
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(100)}
                          >
                            100
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(50)}
                          >
                            50
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(10)}
                          >
                            10
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
                          


        </div>

        <div
          className={`fix-table-column table-wrap table-metadata ${this.state.greaterThanFive ? "greaterThanFive" : "lessThanSix"
            } ${this.state.metadataValue ? "" : "d-none"} ${this.state.metadataHeader.length <= 0 ? 'cosmos-custom-nowidth' : ''}`}
          style={{ width: this.state.totalWidth + "px" }}

        >
          {this.props.isBulkUpdateEnabled && this.state.selectedRows.length > 0 && <div className="All-checkbox-holder">
            <div className="All-checkbox-inner d-flex align-items-center p-2 cosmos-clear-selection">
              <p className="mb-0 pr-4">{this.state.selectedRows.length} Selected</p>
              <button className="button-transparent btn-default font-weight-bold pr-4" onClick={() => this.selectAllRows(true)}>
                Select All
              </button>
              <button className="button-transparent btn-default font-weight-bold pr-4 cosmos-clear-button" onClick={() => this.selectAllRows(false)}>
                Clear Selection
              </button>
              <button
                className="button-transparent btn-default font-weight-bold pr-4 pl-4"
                onClick={() => this.props.setBulkUpdateMetaModal(this.state.selectedRows)}
              >
                Edit Metadata
              </button>
              {/* <button
                className="button-transparent btn-default font-weight-bold pr-4"
                onClick={() => this.props.setBulkUpdateAliasModal(this.state.selectedRows)}
              >
               Edit Status
              </button> */}
              <button
                className="button-transparent btn-default font-weight-bold pr-4"
                onClick={() => this.props.setBulkUpdateAliasModal(this.state.selectedRows)}
              >
               Save Version
              </button>
              <button
                className="button-transparent btn-default font-weight-bold pr-4"
                onClick={() => this.props.setBulkUpdatePathAttributes(this.state.selectedRows)}
              >
               Publishing Status
              </button>
            </div>
          </div>}
          <div ref={this.state.tableMetaRef} className={`table-container table-meta tableFixHeader`} style={{ overflowX: 'scroll' }}>
            <table >
              <thead>
                <tr>
                  <th key={200} style={{ width: this.state.metadataHeader.length > 0 ? this.state.columnWidth + "px" : '' }}>
                    <div style={{ marginLeft: "19px" }}>{"Title"}</div>
                  </th>
                  <th key={2001} style={{ width: this.state.metadataHeader.length > 0 ? this.state.columnWidth + "px" : '' }}>

                    <div className="d-flex align-items-center position-relative ">
                      <div className="d-flex align-items-center fix-table-column-button position-absolute">
                        <button className="button button-default mr-1" onClick={() => { this.onScroll(-200) }} >
                          <span className="material-icons">keyboard_arrow_left</span>
                        </button>
                        <button className="button button-default" onClick={() => { this.onScroll(200) }}>
                          <span className="material-icons">keyboard_arrow_right</span>
                        </button>
                      </div>
                    </div>

                  </th>

                  {this.state.metadataHeader.length > 0 &&
                    this.state.metadataHeader.map((value: any, headerIndex: any) => {
                      let metadataDefinitions = value.metadataDefinitions
                      metadataDefinitions.map((meta: any, index: any) => {
                        headerIndexCount++;
                        if (meta.label.toLowerCase() === "activity type") {
                          activityTypeArrPosition = headerIndexCount;
                        } else if (meta.label.toLowerCase() === "language") {
                          languageArrayPosition = headerIndexCount;
                        } else if (meta.label.toLowerCase() === "annotations") {
                          annotationsArrayPosition = headerIndexCount;
                        }
                        return "";
                      });
                      metadataDefinitions = metadataDefinitions.filter((x:{label:string}) => !ignoreMetadataLabel.includes(x.label))
                      return (
                        <>
                          {metadataDefinitions.length > 0 &&
                            metadataDefinitions.map(
                              (value1: any, index1: any) => {
                                if (this.state.sortingOrder !== true) {
                                  sortClass1 = "sortingreverse";
                                }
                                return (
                                  <th
                                    key={"metadataDefinitions"+index1}
                                    onClick={() =>
                                      this.onSortableBtnClick(
                                        "metadata.name::" + value1.name,
                                        "meta"
                                      )
                                    }
                                    style={{
                                      width: this.state.columnWidth + "px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <div>
                                      {value1.label}
                                      {this.state.sortingColumn ===
                                        "metadata.name::" + value1.name && (
                                          <span
                                            className={
                                              "position-relative " + sortClass1
                                            }
                                            aria-hidden="true"
                                          ></span>
                                        )}
                                    </div>
                                  </th>
                                );
                              }
                            )}
                        </>
                      );
                    })}
                </tr>
              </thead>
              <tbody >
                {masterArray &&
                  masterArray.map((value: any, index: any) => {
                    let pathId = 0;
                    let pathTitle = '';
                    let version = 0;
                    let pathDefId = '';
                    if (value.length >= 1) {
                      pathId = value[0][1];
                      pathTitle = value[0][0];
                      version = value[0][2];
                      pathDefId = value[0][3];
                    }
                    
                    let dataBodyValue = this.state.dataBody.results ? this.state.dataBody.results.find((x:any) => x.learningPath.pathId === pathId) : null ;
                    let isLock: any;
                    dataBodyValue?.learningPath?.entityAttributes?.map((element: any) => {
                      if(element.definitionId === this.props.lockunlockDefinitionId) {
                        isLock = element.value.toLowerCase() === "lock" ? true : false;
                      }
                      return ""
                    })

                    return (
                      <tr>
                        {value.length > 0 &&
                          value.map((value1: any, index1: any) => {
                            if (index1 === 0) {
                              return (
                                <React.Fragment key={"value"+index1}>
                                  <td >
                                    <div className="d-flex align-items-center position-relative z-index-2">
                                      <div>
                                        { 
                                          !isLock &&
                                          this.props.bulkUpdateInMetadaView && this.props.isBulkUpdateEnabled &&
                                          this.props.userPermission.contentManagement !== "Read Only" && (
                                            <input
                                              type="checkbox"
                                              checked={this.state.dataBody.results && this.state.dataBody.results[index] && this.state.dataBody.results[index].selected}
                                              className="mr-2 mt-1"
                                              onChange={(e: any) => this.selectSingleRow(e.target.checked, index)}
                                            />
                                          )
                                        }
                                      </div>
                                      <div className="d-flex justify-content-start align-items-center table-metadata-action">
                                        {/* <a href="#">{`${(value1[0]==='null')?'':value1[0]}`}</a>*/}

                                        {this.props.dropDownValue === "MPNG" ? (
                                          <>

                                            <Link
                                            style={{marginLeft: `${this.props.userPermission.contentManagement !== "Read Only" && isLock && "0"}`}}
                                              to={"#"}
                                              onClick={() =>
                                                this.setUserMpng(
                                                  "/mpngReader/" +
                                                  value[0][1] +
                                                  "/" +
                                                  encodeURIComponent(value[0][0]) +
                                                  (activityTypeArrPosition > -1
                                                    ? "/" +
                                                    value[
                                                    activityTypeArrPosition
                                                    ]
                                                    : ""),
                                                  value[annotationsArrayPosition]
                                                )
                                              }
                                            >{`${value1[0] === "null" ? "" : value1[0]
                                              }`}</Link>
                                          </>
                                        ) : (
                                          this.props.dropDownValue === "CWNG" ? 

                                            <Link
                                            style={{marginLeft: `${this.props.userPermission.contentManagement !== "Read Only" && isLock && "0"}`}}
                                            to={
                                              "/cwngReader/" +
                                                  value[0][1] +
                                                  "/student/" +
                                                  value[0][0]
                                              }
                                              onClick={() =>
                                                {
                                                  const data = {
                                                    productId: this.props.productId,
                                                    dropdownValue: this.props.dropDownValue,
                                                  }
                                                  localStorage.setItem('readerInfo', JSON.stringify(data));
                                                  localStorage.setItem("AnnotationsProperty", languageArrayPosition > -1
                                                  ? value[languageArrayPosition]
                                                  : "");
                                                  localStorage.setItem("DoLittleLanguageSelection", value[annotationsArrayPosition])
                                                }
                                              }
                                            >{`${value1[0] === "null" ? "" : value1[0]
                                              }`}</Link>
                                            :

                                            <Link
                                            style={{marginLeft: `${this.props.userPermission.contentManagement !== "Read Only" && isLock && "0"}`}}
                                              to={"#"}
                                              onClick={() =>
                                                this.setUserStudent(
                                                  "/reader/" +
                                                  value[0][1] +
                                                  "/student/" +
                                                  value[0][0],
                                                  languageArrayPosition > -1
                                                    ? value[languageArrayPosition]
                                                    : "",
                                                  value[annotationsArrayPosition]
                                                )
                                              }
                                            >{`${value1[0] === "null" ? "" : value1[0]
                                              }`}</Link>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    
                                  {dataBodyValue ?
                                    <Options 
                                    propsSentFrom={"metadata"}
                                    userPermission={this.props.userPermission}
                                    renamePathCallback={() => this.props.renamePathCallback(dataBodyValue)}
                                    duplicatePathCallback={() => this.props.duplicatePathCallback(dataBodyValue, isLock)}
                                    deletePathCallback={() => this.props.deletePathCallback(dataBodyValue)}
                                    addToProjectFlow={() => this.props.addToProjectFlow(dataBodyValue?.learningPath?.entityAttributes,dataBodyValue?.learningPath?.name, dataBodyValue?.learningPath?.pathId)}
                                    setAliasCallback={() => this.props.setAliasCallback(dataBodyValue)}
                                    flatView={() => this.props.flatView(dataBodyValue)}
                                    type={this.props.type}
                                    WorkstatusFlow={() => this.props.WorkstatusFlow(dataBodyValue?.learningPath?.entityAttributes,dataBodyValue?.learningPath?.name, dataBodyValue?.learningPath?.pathId)}
                                    createLinkForm={() => this.props.createLinkForm(dataBodyValue?.learningPath)}
                                    setUserDesignerEdit={() => this.setUserDesigner(
                                      "/reader/" +
                                      value[0][1] +
                                      "/designer/" +
                                      value[0][0],
                                      languageArrayPosition > -1
                                        ? value[languageArrayPosition]
                                        : "",
                                      value[annotationsArrayPosition],
                                      false
                                    )}
                                    setUserDesignerView={() => this.setUserDesigner(
                                      "/reader/" +
                                      value[0][1] +
                                      "/designer/" +
                                      value[0][0],
                                      languageArrayPosition > -1
                                        ? value[languageArrayPosition]
                                        : "",
                                      value[annotationsArrayPosition],
                                      true
                                    )}
                                    onInspectBtnClick={() => this.onInspectBtnClick(this.props.productId, pathId, pathTitle, this.props.pathRefName, this.props.pathRefId, value[0][4], isLock)}
                                    isMetaData={true}
                                    activityType={this.props.type}
                                    isLock={isLock}
                                    lockPath={()=> isLock ? this.handleLockPath(dataBodyValue)  : this.onLock(dataBodyValue)}
                                    
                                    singleElement={dataBodyValue}  
                                    pathCustomSetting={this.props.pathDetails}
                                    lockUnlockSinglePathFlagger={this.props.lockUnlockSinglePathFlagger}
                                  />
                                   :
                                  ""
                                  }
                                  

                                    <span className="rename-button-border"></span>
                                    {/* <button
                                      className="button button-primary"
                                      disabled={
                                        this.props.userPermission
                                          .contentManagement === "Read Only"
                                      }
                                      onClick={() =>
                                        this.setUserDesigner(
                                          "/reader/" +
                                          value[0][1] +
                                          "/designer/" +
                                          value[0][0],
                                          languageArrayPosition > -1
                                            ? value[languageArrayPosition]
                                            : "",
                                          value[annotationsArrayPosition]
                                        )
                                      }
                                    >
                                      Edit
                                    </button> */}
                                  </td>
                                </React.Fragment>
                              );
                            } else {
                              /*eslint-disable */
                              const commaNewLineData =
                                value1 &&
                                value1
                                  .split(",")
                                  .map((item: any) => item.trim())
                                  .join("," + "\n");
                              /*eslint-enable */
                              return (
                                <td
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                  }}
                                  key={"commaNewLineData"+index1}
                                  onClick={() =>
                                    { !isLock && this.showMetaPopup(
                                      pathId,
                                      pathTitle,
                                      version,
                                      pathDefId,
                                      this.props.userPermission.contentManagement
                                    )}
                                  }
                                >
                                  <span
                                    style={{ WebkitLineClamp: "inherit" }}
                                  >{`${commaNewLineData === "null"
                                    ? ""
                                    : commaNewLineData
                                    }`}</span>
                                </td>
                              );
                            }
                          })}
                      </tr>
                    );
                  })}
              </tbody>
              {/* <tfoot className="d-none">
                <tr>
                  <td colSpan={4}>
                    <div className="custom-pagination d-flex justify-content-start align-items-center">
                      <p className="mb-0 mr-4">
                        Viewing Records{" "}
                        {this.state.pageSize * (this.state.currentPageNo + 1) -
                          this.state.pageSize +
                          1}{" "}
                        -{" "}
                        {this.state.pageSize * (this.state.currentPageNo + 1) >
                          this.state.totalCount
                          ? this.state.totalCount
                          : this.state.pageSize *
                          (this.state.currentPageNo + 1)}{" "}
                        of {this.state.totalCount}
                      </p>

                      <ul className="pagination mb-0 mr-4">
                        <li className="page-item">
                          <button
                            className="page-link arrow"
                            aria-label="Previous"
                            onClick={this.onPrevBtnClick}
                            disabled={this.state.currentPageNo === 0}
                          >
                            <FontAwesomeIcon
                              icon={["fal", "chevron-double-left"]}
                            />
                            <span className="sr-only">Previous</span>
                          </button>
                        </li>
                        {pageNumbers &&
                          pageNumbers.map((number: any, idx: any) => {
                            return (
                              <li
                                className={`page-item ${this.state.currentPageNo + 1 === number
                                  ? "active"
                                  : ""
                                  }  `}
                                key={idx}
                              >
                                <button
                                  className="page-link"
                                  onClick={(e: any) =>
                                    this.onHandlePaginationNumbers(number)
                                  }
                                >
                                  {number}
                                </button>
                              </li>
                            );
                          })}
                        <li className="page-item">
                          <button
                            className="page-link arrow"
                            aria-label="Next"
                            onClick={this.onNextBtnClick}
                            disabled={
                              this.state.currentPageNo ===
                              this.state.totalPages - 1 ||
                              this.state.totalPages === 0
                            }
                          >
                            <FontAwesomeIcon
                              icon={["fal", "chevron-double-right"]}
                            />
                            <span className="sr-only">Next</span>
                          </button>
                        </li>
                      </ul>

                      <div className="dropdown pagination-dropdown">
                        <button
                          className="btn btn-primary dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                        >
                          {this.state.pageSize}
                          <span className="caret active">
                            <FontAwesomeIcon icon={["fal", "chevron-down"]} />
                          </span>
                          <span className="caret colorarrow">
                            <FontAwesomeIcon icon={["fal", "chevron-up"]} />
                          </span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              onClick={() => this.onChangePerPagecount(200)}
                            >
                              200
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => this.onChangePerPagecount(100)}
                            >
                              100
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => this.onChangePerPagecount(50)}
                            >
                              50
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => this.onChangePerPagecount(10)}
                            >
                              10
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>              */}
            </table>
          </div>

          <table className="w-100">
            <tfoot>
              <tr>
                <td>
                  <div className="custom-pagination d-flex justify-content-start align-items-center py-1">
                    <p className="mb-0 mr-4">
                      Viewing Records{" "}
                      {this.state.pageSize * (this.state.currentPageNo + 1) -
                        this.state.pageSize +
                        1}{" "}
                      -{" "}
                      {this.state.pageSize * (this.state.currentPageNo + 1) >
                        this.state.totalCount
                        ? this.state.totalCount
                        : this.state.pageSize *
                        (this.state.currentPageNo + 1)}{" "}
                      of {this.state.totalCount}
                    </p>

                    <ul className="pagination mb-0 mr-4">
                      <li className="page-item">
                        <button
                          className="page-link arrow"
                          aria-label="Previous"
                          onClick={this.onPrevBtnClick}
                          disabled={this.state.currentPageNo === 0}
                        >
                          <FontAwesomeIcon
                            icon={["fal", "chevron-double-left"]}
                          />
                          <span className="sr-only">Previous</span>
                        </button>
                      </li>
                      {pageNumbers &&
                        pageNumbers.map((number: any, idx: any) => {
                          return (
                            <li
                              className={`page-item ${this.state.currentPageNo + 1 === number
                                ? "active"
                                : ""
                                }  `}
                              key={"pageNumbers_2"+idx}
                            >
                              <button
                                className="page-link"
                                onClick={(e: any) =>
                                  this.onHandlePaginationNumbers(number)
                                }
                              >
                                {number}
                              </button>
                            </li>
                          );
                        })}
                      <li className="page-item">
                        <button
                          className="page-link arrow"
                          aria-label="Next"
                          onClick={this.onNextBtnClick}
                          disabled={
                            this.state.currentPageNo ===
                            this.state.totalPages - 1 ||
                            this.state.totalPages === 0
                          }
                        >
                          <FontAwesomeIcon
                            icon={["fal", "chevron-double-right"]}
                          />
                          <span className="sr-only">Next</span>
                        </button>
                      </li>
                    </ul>

                    <div className="dropdown pagination-dropdown">
                      <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        data-toggle="dropdown"
                      >
                        {this.state.pageSize}
                        <span className="caret active">
                          <FontAwesomeIcon icon={["fal", "chevron-down"]} />
                        </span>
                        <span className="caret colorarrow">
                          <FontAwesomeIcon icon={["fal", "chevron-up"]} />
                        </span>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(200)}
                          >
                            200
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(100)}
                          >
                            100
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(50)}
                          >
                            50
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => this.onChangePerPagecount(10)}
                          >
                            10
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

const CosDataTable = connect((state: AppState) => ({
  isJiraIntegrationEnabled: state.flagger.flagr.jiraIntegration,
  isBulkUpdateEnabled: state.flagger.flagr.bulkupdatemeta,
  bulkUpdateInMetadaView: state.flagger.flagr.bulkUpdateInMetadaView,
  addToProjectFlagger: state.flagger.flagr.AddToProject
}))(CosDataTableUnconnected);

export default CosDataTable;
