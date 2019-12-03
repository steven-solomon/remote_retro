defmodule RemoteRetroWeb.GroupHandlers do
  alias RemoteRetro.{Repo, Group}

  import ShorterMaps

  def handle_in("update_group_name", ~m{id,name}, socket) do
    Repo.transaction fn ->
      Group
      |> Repo.get!(id)
      |> Group.changeset(~M{name})
      |> Repo.update!()
    end
    {:reply, :ok, socket}
  end
end
