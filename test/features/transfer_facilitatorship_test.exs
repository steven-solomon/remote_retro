defmodule TransferFacilitatorshipTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  test "facilitator can pass the facilitatorship to another user", ~M{retro, session: facilitator_session, non_facilitator} do
    non_facilitator_session = new_authenticated_browser_session(non_facilitator)

    retro_path = "/retros/" <> retro.id
    facilitator_session = visit(facilitator_session, retro_path)
    non_facilitator_session = visit(non_facilitator_session, retro_path)

    assert_has(facilitator_session, Query.css("button", text: "Voting"))

    facilitator_session
    |> initiate_and_confirm_transfer_of_facilitatorship(to: non_facilitator)

    non_facilitator_session
    |> assert_has(Query.css("body", text: "You've been granted the facilitatorship!"))
    |> assert_has(Query.css("button", text: "Voting"))
  end

  defp initiate_and_confirm_transfer_of_facilitatorship(facilitator_session, to: non_facilitator) do
    accept_confirm(facilitator_session, fn(session) ->
      session
      |> find(Query.css("li button[title='Transfer facilitatorship to #{non_facilitator.given_name}']"))
      |> Element.click()
    end)
  end
end
