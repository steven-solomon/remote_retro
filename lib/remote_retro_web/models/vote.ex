defmodule RemoteRetro.Vote do
  use RemoteRetroWeb, :model

  @derive {Jason.Encoder, except: [:__meta__, :user, :idea]}
  schema "votes" do
    belongs_to(:user, RemoteRetro.User)
    belongs_to(:idea, RemoteRetro.Idea)

    timestamps(type: :utc_datetime_usec)
  end

  @allowed_fields [:user_id, :idea_id]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_fields)
    |> validate_required([:user_id, :idea_id])
  end
end
