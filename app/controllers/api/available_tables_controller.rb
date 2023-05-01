class Api::AvailableTablesController < ApplicationController
    def create
        @restaurant = Restaurant.find_by(id: params[:restaurant_id])
        @errors = []
        if @restaurant
            AvailableTable.transaction do
                available_table_params.each do |param|
                    if param[:id]
                        available_table = AvailableTable.find_by(id: param[:id])
                        if param[:tables] == 0
                            available_table.destroy
                        else
                            available_table.update(**param, restaurant_id: @restaurant.id)
                        end
                    elsif param[:tables] > 0
                        available_table = AvailableTable.new(**param, restaurant_id: @restaurant.id)
                        available_table.save
                    end

                    @errors.append(*available_table.errors.full_messages) unless (available_table.errors.empty?)
                end
            end
            if @errors.count === 0
                return render "api/restaurants/show"
            end
        else
            @errors << 'Invalid restaurant id'
        end
        render "api/shared/error", status: :unprocessable_entity
    end

    def available_table_params
        params.require(:available_table).map { |param| param.permit(:id, :seats, :tables) }
    end
end
