import React from "react"
import { spy } from "sinon"
import { shallow } from "enzyme"

import ConditionallyDraggableIdeaContent from "../../web/static/js/components/conditionally_draggable_idea_content"
import IdeaContentBase from "../../web/static/js/components/idea_content_base"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, GROUPING } = STAGES

describe("<ConditionallyDraggableIdeaContent />", () => {
  let wrapper

  const defaultProps = {
    idea: { body: "body text" },
    currentUser: {},
    retroChannel: {},
    isTabletOrAbove: true,
    stage: IDEA_GENERATION,
    canUserEditIdeaContents: true,
  }

  context("when the device is tablet or larger", () => {
    context("when the user has edit permissions", () => {
      context("when the stage is idea-generation", () => {
        beforeEach(() => {
          const props = {
            ...defaultProps,
            isTabletOrAbove: true,
            canUserEditIdeaContents: true,
            stage: "idea-generation",
          }

          wrapper = shallow(
            <ConditionallyDraggableIdeaContent {...props} />
          )
        })

        it("renders IdeaContentBase as draggable", () => {
          expect(wrapper.find(IdeaContentBase).prop("draggable")).to.eql(true)
        })
      })

      context("when the stage is *not* idea-generation", () => {
        const props = {
          ...defaultProps,
          isTabletOrAbove: true,
          canUserEditIdeaContents: true,
          stage: "voting",
        }

        beforeEach(() => {
          wrapper = shallow(
            <ConditionallyDraggableIdeaContent {...props} />
          )
        })

        it("renders IdeaContentBase as non-draggable", () => {
          expect(wrapper.find(IdeaContentBase).prop("draggable")).to.eql(false)
        })
      })
    })

    context("when the user lacks edit permissions", () => {
      context("and the stage is idea-generation", () => {
        const props = {
          ...defaultProps,
          isTabletOrAbove: true,
          canUserEditIdeaContents: false,
          stage: IDEA_GENERATION,
        }

        beforeEach(() => {
          wrapper = shallow(
            <ConditionallyDraggableIdeaContent {...props} />
          )
        })

        it("renders IdeaContentBase as non-draggable", () => {
          expect(wrapper.find(IdeaContentBase).prop("draggable")).to.eql(false)
        })
      })
    })

    context("when the stage is grouping", () => {
      context("and the user is neither the facilitator", () => {
        context("nor the author of the idea", () => {
          beforeEach(() => {
            wrapper = shallow(
              <ConditionallyDraggableIdeaContent
                {...defaultProps}
                currentUser={{
                  is_facilitator: false,
                  id: 393939393939,
                }}
                stage={GROUPING}
              />
            )
          })

          it("renders IdeaContentBase as draggable", () => {
            expect(wrapper.find(IdeaContentBase).prop("draggable")).to.eql(true)
          })
        })
      })
    })

    context("when the idea is being dragged", () => {
      const idea = { id: 1, body: "yo sup" }
      const props = {
        ...defaultProps,
        stage: "idea-generation",
        idea,
      }

      const mockDragEvent = {
        preventDefault: () => {},
        dataTransfer: { setData: spy(), dropEffect: null },
      }

      beforeEach(() => {
        wrapper = shallow(
          <ConditionallyDraggableIdeaContent {...props} />
        )

        wrapper.simulate("dragStart", mockDragEvent)
      })

      it("sets the drop effect on the event to 'move'", () => {
        expect(mockDragEvent.dataTransfer.dropEffect).to.eql("move")
      })

      it("sets the idea id on the event data element", () => {
        const stringifiedIdea = JSON.stringify(idea)
        expect(
          mockDragEvent.dataTransfer.setData
        ).calledWith("idea", stringifiedIdea)
      })
    })
  })

  context("when the device has a screen width less than the common tablet", () => {
    context("and the user has edit permissions and the stage is idea-generation", () => {
      beforeEach(() => {
        const props = {
          ...defaultProps,
          isTabletOrAbove: false,
          canUserEditIdeaContents: true,
          stage: "idea-generation",
        }

        wrapper = shallow(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("renders IdeaContentBase as non-draggable", () => {
        expect(wrapper.find(IdeaContentBase).prop("draggable")).to.eql(false)
      })
    })
  })
})
